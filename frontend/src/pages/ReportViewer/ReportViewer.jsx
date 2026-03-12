import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertCircle } from 'lucide-react';

const ReportViewer = () => {
    const { id } = useParams();
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                // Find report details to get IPFS URL
                const res = await axios.get(`http://localhost:5000/api/reports/detail/${id}`);
                if (res.data && res.data.ipfsUrl) {
                    window.location.replace(res.data.ipfsUrl);
                } else {
                    setError('Report URL not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to securely fetch document from the network.');
            }
        };

        if (id) {
            fetchReport();
        }
    }, [id]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] px-4">
                <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-100 max-w-lg w-full">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-red-700 mb-2">Access Error</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh] px-4">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Securing Connection...</h2>
                <p className="text-gray-500 max-w-md mx-auto">Redirecting to decentralized IPFS network to securely view your document.</p>
            </div>
        </div>
    );
};

export default ReportViewer;
