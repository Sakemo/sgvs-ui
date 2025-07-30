// React and hooks
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDebounce from '../hooks/useDebounce';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

// API & Types
import { getProducts, toggleProductStatus, deleteProductPermanently, copyProduct, type GetProductsParams } from '../api/services/product.service';
import { getCategories } from '../api/services/category.service';
import { getProviders } from '../api/services/provider.service';
import type { ProductResponse } from '../api/types/domain';

// Components
import ProductsTable from '../components/features/products/ProductsTable';
import ProductFormModal from '../components/features/products/ProductFormModal';
import ProductDetailsDrawer from '../components/features/products/ProductDetailsDrawer';
import Button from '../components/common/ui/Button';
import Card from '../components/common/ui/Card';
import Input from '../components/common/ui/Input';
import Select from '../components/common/ui/Select';
import { LuPlus, LuSearch } from 'react-icons/lu';
import clsx from 'clsx';
import Pagination from '../components/common/Pagination';
import { useConfirmation } from '../contexts/utils/UseConfirmation';
import { notificationService } from '../lib/notification.service';

const ProductsPage: React.FC = () => {
    const { t } = useTranslation();
    const showConfirmation = useConfirmation();
    const queryClient = useQueryClient();

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<ProductResponse | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

    // Filters & Sorting State
    const [filters, setFilters] = useState<Omit<GetProductsParams, 'page' | 'size'>>({
        name: '',
        categoryId: undefined,
        orderBy: 'name_asc',
    });
    const [currentPage, setCurrentPage] = useState(0);
    const debouncedNameFilter = useDebounce(filters.name, 400);
    const orderOptions = [
        { value: 'name_asc', label: t('product.sort.az', 'Name (A-Z)') },
        { value: 'name_desc', label: t('product.sort.za', 'Name (Z-A)') },
        { value: 'price_desc', label: t('product.sort.mostExpensive', 'Most Expensive') },
        { value: 'price_asc', label: t('product.sort.leastExpensive', 'Least Expensive') },
        { value: 'date_desc', label: t('filter.mostRecent', 'Most Recent') },
        { value: 'date_asc', label: t('filter.oldest', 'Oldest') },
        // { value: 'mostSold', label: t('product.sort.mostSold', 'Most Sold') },
    ];

    // --- QUERIES ---
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
    const { data: providers = [] } = useQuery({
        queryKey: ['providers'],
        queryFn: getProviders,
    });

    const { data: productsPage, isLoading: isLoadingTable } = useQuery({
        queryKey: ['products', { ...filters, name: debouncedNameFilter, page: currentPage }],
        queryFn: () => getProducts({
            ...filters,
            name: debouncedNameFilter?.trim() || undefined,
            page: currentPage,
            size: 10,
        }),
        placeholderData: keepPreviousData,
    })

    // --- MUTATIONS ---
    const deleteMutation = useMutation({
        mutationFn: deleteProductPermanently,
        onSuccess: () => {
            notificationService.success(t('product.deleteSuccess'));
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => notificationService.error(t('error.deleteProduct')),
    });
    const toggleStatusMutation = useMutation({
        mutationFn: (id: number) => toggleProductStatus(id),
        onSuccess: () => {
            notificationService.success(t('product.statusUpdated'));
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => notificationService.error(t('errors.toggleStatus')),
    });
    const copyMutation = useMutation({
        mutationFn: copyProduct,
        onSuccess: () => {
            notificationService.success(t('product.copySuccess'));
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => notificationService.error(t('errors.copyProduct')),
    });

    // --- Handlers de Ação ---
    const handleFilterChange = (
        field: keyof typeof filters, 
        value: string | number | undefined
    ) => {
        setCurrentPage(0);
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    const handleOpenModal = (product: ProductResponse | null) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false); 
    const handleSaveSuccess = () => {
        handleCloseModal();
        notificationService.success(t('product.saveSuccess', 'Product saved successfully!'))
    };
    const handleDelete = (id: number) => {
        showConfirmation({
            title: t('product.confirmDeleteTitle'),
            description: t('actions.confirmDeletePermanent'),
            onConfirm: () => {
                if (selectedProduct?.id === id) setSelectedProduct(null);
                deleteMutation.mutate(id);
            }
        });
    };
    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        const actionText = currentStatus ? t('actions.deactivate') : t('actions.activate');
        showConfirmation({
            title: t('product.confirmToggleTitle', { action: actionText }),
            description: t('product.confirmToggleDesc'),
            onConfirm: () => toggleStatusMutation.mutate(id),
        });
    };
    const handleCopy = async (id: number) => {
        showConfirmation({
            title: t('product.confirmCopyTitle', 'Copy Product?'),
            description: t('product.confirmCopyDesc', 'This will create a new, inactive copy of the product'),
            confirmText: t('actions.copy'),
            onConfirm: () => copyMutation.mutate(id),
        });
    };
    const handleRowClick = (product: ProductResponse) => {
        setSelectedProduct(prev => (prev?.id === product.id ? null : product));
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-2xl font-semibold text-text-primary dark:text-gray-200">
                    {t('product.pageTitle', 'Products Management')}
                </h1>
                <Button onClick={() => handleOpenModal(null)} iconLeft={<LuPlus />}>
                    {t('product.addProduct', 'Add Product')}
                </Button>
            </header>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder={t('actions.searchByName', 'Search by name...')}
                        value={filters.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('name', e.target.value)}
                        iconLeft={<LuSearch className="h-4 w-4 text-text-secondary" />}
                    />
                    <Select
                        value={filters.categoryId ?? ''}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
                    >
                        {/* O texto das opções herda a cor do <select> */}
                        <option value="">{t('product.allCategories', 'All Categories')}</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </Select>
                    <Select
                        value={filters.orderBy}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('orderBy', e.target.value)}
                    >
                        {/* O texto das opções herda a cor do <select> */}
                        {orderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                </div>
            </Card>

            <div className={clsx("flex flex-col lg:flex-row", selectedProduct ? "gap-6" : "gap-0")}>
                <div className={clsx("transition-all duration-300 ease-in-out", selectedProduct ? "lg:w-2/3" : "w-full")}>
                    <ProductsTable
                        products={productsPage?.content ?? []}
                        isLoading={isLoadingTable}
                        onEdit={handleOpenModal}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                        onRowClick={handleRowClick}
                        selectedProductId={selectedProduct?.id}
                    />
                    {productsPage && productsPage.totalPages > 1 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={productsPage.number}
                                totalPages={productsPage.totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
                <div className={clsx("transition-all duration-300 ease-in-out", selectedProduct ? "lg:w-1/3 opacity-100" : "w-0 opacity-0 pointer-events-none")}>
                    {selectedProduct && (
                        <ProductDetailsDrawer 
                            product={selectedProduct} 
                            onClose={() => setSelectedProduct(null)} 
                            onEdit={handleOpenModal} 
                        />
                    )}
                </div>
            </div>
            {isModalOpen && (
                <ProductFormModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                    productToEdit={productToEdit}
                    categories={categories}
                    providers={providers} />
                )}
        </div>
    );
};

export default ProductsPage;