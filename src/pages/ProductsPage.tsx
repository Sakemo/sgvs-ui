// React and hooks
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useDebounce from '../hooks/useDebounce';

// API & Types
import { getProducts, toggleProductStatus, deleteProductPermanently, copyProduct, type GetProductsParams } from '../api/services/product.service';
import { getCategories } from '../api/services/category.service';
import type { ProductResponse, EntitySummary, Page } from '../api/types/domain';

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
import { getProviders } from '../api/services/provider.service';
import { useConfirmation } from '../contexts/utils/UseConfirmation';

const ProductsPage: React.FC = () => {
    const { t } = useTranslation();
    const showConfirmation = useConfirmation();

    // Data State
    const [productsPage, setProductsPage] = useState<Page<ProductResponse> | null>(null);
    const [categories, setCategories] = useState<EntitySummary[]>([]);
    const [providers, setProviders] = useState<EntitySummary[]>([]);

    // UI State
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    //fetchdata
    const fetchDependencies = useCallback(async () => {
        try {
            const [categoriesData, providersData] = await Promise.all([
                getCategories(), getProviders()
            ]);
            setCategories(categoriesData);
            setProviders(providersData);
        } catch (err) {
            setError(t(`errors.fetchInitialData` + err ));
        } finally {
            setIsLoadingPage(false);
        }
    }, [t]);

    const fetchProducts = useCallback(async () => {
        setIsLoadingTable(true); 
        try {
            const params: GetProductsParams = {
                ...filters,
                name: debouncedNameFilter?.trim() || undefined,
                page: currentPage,
                size: 10,
            };
            const data = await getProducts(params);
            setProductsPage(data);
        } catch (err) {
            setError(t('errors.fetchProducts' + err));
        } finally {
            setIsLoadingTable(false);
        }
    }, [filters, currentPage, debouncedNameFilter, t]);

    // Effects
    useEffect(() => {
        fetchDependencies();
    }, [fetchDependencies]);
    
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
        fetchProducts();
    };

    const handleDataRefresh = () => {
        fetchDependencies();
    }
    
    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        const actionText = currentStatus ? t('actions.deactivate') : t('actions.activate');
        showConfirmation({
            title: t('product.confirmToggleTitle', { action: actionText }),
            description: t('product.confirmToggleDesc', 'Are you sure you want to proceed?'),
            confirmText: actionText,
            onConfirm: async () => {
                try {
                    await toggleProductStatus(id);
                    fetchProducts();
                } catch {
                    setError(t('errors.toggleStatus'));
                }
            }
        });
    };

    const handleCopy = async (id: number) => {
        showConfirmation({
            title: t('product.confirmCopyTitle', 'Copy Product?'),
            description: t('product.confirmCopyDesc', 'This will create a new, inactive copy of the product'),
            confirmText: t('actions.copy'),
            onConfirm: async () => {
                try {
                    await copyProduct(id);
                    fetchProducts();
                } catch {
                    setError(t('errors.copyProduct'));
                }
            }
        });
    };

    const handleDelete = async (id: number) => {
        showConfirmation({
            title: t('product.confirmDeleteTitle', 'Delete Product?'),
            description: t('actions.confirmDeletePermanent'),
            confirmText: t('actions.delete'),
            onConfirm: async () => {
                try {
                    await deleteProductPermanently(id);
                    if (selectedProduct?.id === id) setSelectedProduct(null);
                    fetchProducts();
                } catch {
                    setError(t('errors.deleteProduct'));
                }
            }
        });
    };

    const handleRowClick = (product: ProductResponse) => {
        setSelectedProduct(prev => (prev?.id === product.id ? null : product));
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-2xl font-semibold">{t('product.pageTitle', 'Products Management')}</h1>
                <Button onClick={() => handleOpenModal(null)} iconLeft={<LuPlus className='mr-2 h-4 w-4'/>}>
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
                        <option value="">{t('product.allCategories', 'All Categories')}</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </Select>
                    <Select
                        value={filters.orderBy}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('orderBy', e.target.value)}
                    >
                        {orderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                </div>
            </Card>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className={clsx("transition-all duration-300 ease-in-out", selectedProduct ? "lg:w-2/3" : "w-full")}>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
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
                        <ProductDetailsDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} onEdit={handleOpenModal} />
                    )}
                </div>
            </div>

            {isModalOpen && (
                <ProductFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSaveSuccess={handleSaveSuccess} productToEdit={productToEdit} categories={categories} providers={providers} onDataRefresh={handleDataRefresh}/>
            )}
        </div>
    );
};

export default ProductsPage;