export const WarningToast = ({ message }: { message: string }) => (
  <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-yellow-800">Warning</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  </div>
);