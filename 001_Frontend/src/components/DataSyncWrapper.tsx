import React, { useEffect } from 'react';
import { syncService } from '@/services/sync';

interface Props {
    children: React.ReactNode;
}

const DataSyncWrapper: React.FC<Props> = ({ children }) => {
    useEffect(() => {
        // Initialize sync service when app loads
        syncService.init();
    }, []);

    return <>{children}</>;
};

export default DataSyncWrapper;
