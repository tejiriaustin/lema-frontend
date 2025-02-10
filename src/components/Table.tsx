import { ReactNode, useState } from "react";
import { Loader } from "./Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
    header: string;
    key: keyof T;
    width?: string;
    render?: (value: T[keyof T], item: T) => ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    rowsPerPage?: number;
    currentPage: number
    onPageChange: (page: number) => void
    totalPages: number
}

export function Table<T>({data, columns, onRowClick, isLoading, rowsPerPage = 4,}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200 font-inter">
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={String(column.key)}
                            className="text-left text-[14px] font-medium text-gray-700 py-3 px-6"
                            style={{ width: column.width }}
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                        <tr
                            key={index}
                            onClick={() => onRowClick?.(item)}
                            className="cursor-pointer border-b last:border-none hover:bg-gray-50"
                        >
                            {columns.map((column) => (
                                <td key={String(column.key)}
                                    className={`text-[16px] text-gray-500 py-3 px-6 tracking-wide ${
                                        column.key === 'fullName' ? 'font-medium text-[#535862]' : 'font-normal'
                                    }`}>
                                    {column.render
                                        ? column.render(item[column.key], item)
                                        : String(item[column.key] || "")}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="text-center text-gray-500 py-4">
                            No data available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
                    <button
                        className={`flex items-center gap-1 text-sm ${
                            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-gray-900"
                        }`}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg ${
                                    currentPage === page ? "bg-purple-200 text-purple-800 font-semibold" : "text-gray-700 hover:bg-gray-100"
                                }`}
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        className={`flex items-center gap-1 text-sm ${
                            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-gray-900"
                        }`}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
