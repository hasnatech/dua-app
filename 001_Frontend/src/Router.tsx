import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/sonner"
import DataSyncWrapper from '@/components/DataSyncWrapper';
// import { AuthProvider } from '@/context/AuthContext';
// import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy load pages

const PublicHome = lazy(() => import('@/pages/Public/Home'));
const CategoryShow = lazy(() => import('@/pages/Public/Category/Show'));
const DuaViewer = lazy(() => import('@/pages/Public/DuaViewer'));
// const PublicVideos = lazy(() => import('@/pages/Public/Videos/Index'));

const Router = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            {/* <AuthProvider> */}
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <DataSyncWrapper>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<PublicHome />} />
                        <Route path="/category/:id" element={<CategoryShow />} />
                        <Route path="/dua/:id" element={<DuaViewer />} />
                        {/* <Route path="/videos" element={<PublicVideos />} /> */}
                    </Routes>
                </DataSyncWrapper>
                <Toaster />
            </Suspense>
            {/* </AuthProvider> */}
        </BrowserRouter>
    );
};

export default Router;
