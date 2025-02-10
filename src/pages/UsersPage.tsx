import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers.tsx';
import { Table } from '../components/Table';
import { Loader } from '../components/Loader';
import { User, Address } from '../types';
import {Button} from "../components/Button.tsx";
import {CreateUserModal} from "../components/CreateUserModal.tsx";

export function UsersPage() {
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, createUser, isLoading } = useUsers(page);

    const columns = [
        { header: "Full Name", key: "fullName" as const },
        { header: "Email Address", key: "email" as const },
        {
            header: "Address",
            key: "address" as const,
            width: "392px",
            render: (value: Address | string) => {
                const address = value as Address;
                return `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`;
            }
        }
    ]

    const handleRowClick = (user: User) => {
        navigate(`/users/${user.id}/posts`)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSubmit = async (userData: { full_name: string; email: string; address: Address }) => {
        createUser(userData)
        setIsModalOpen(false)
    }

    if (isLoading) return (
        <div className="absolute inset-0 flex items-center justify-center">
            <Loader />
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-7xl mb-6 font-">Users</h1>
                <Button title="Create User" variant="primary" onClick={() => setIsModalOpen(true)}/>
            </div>
            <div className="rounded-lg shadow-sm">
                <Table
                    data={data?.data?.body.users || []}
                    columns={columns}
                    onRowClick={handleRowClick}
                    rowsPerPage={10}
                    currentPage={page}
                    onPageChange={handlePageChange}
                    totalPages={data?.data?.totalPages || 1}
                />
            </div>

            <CreateUserModal
                onClose={() => setIsModalOpen(false)}
                isOpen={isModalOpen}
                onSubmit={handleSubmit}
            />
        </div>
    )
}