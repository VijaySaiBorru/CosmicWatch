import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import nasaApi from '../redux/features/nasa/nasaApi';
import { useEffect } from 'react';

const SocketAlerts = () => {
    const { user } = useSelector((state) => state.auth);
    const { socket } = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const onAsteroidAlert = (alert) => {


            dispatch(nasaApi.util.invalidateTags(['Alerts']));

            toast(
                (t) => (
                    <div className="flex flex-col gap-1 min-w-[250px]">
                        <div className="font-bold text-purple-400 flex items-center gap-2">
                            <span>🚀</span> {alert.name}
                        </div>
                        <div className="text-sm text-gray-200">
                            {alert.message}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Risk: <span className={
                                alert.risk_level === 'HIGH' ? 'text-red-400 font-bold' :
                                    alert.risk_level === 'MEDIUM' ? 'text-orange-400' : 'text-blue-400'
                            }>{alert.risk_level}</span>
                        </div>
                        <a
                            href={alert.app_url || `/asteroid/${alert.asteroidId}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded mt-2 text-center transition-colors"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            View Details
                        </a>
                    </div>
                ),
                {
                    duration: 6000,
                    position: 'top-right',
                    style: {
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                    },
                    icon: '⚠️',
                }
            );
        };

        socket.on('asteroid_alert', onAsteroidAlert);

        return () => {
            socket.off('asteroid_alert', onAsteroidAlert);
        };
    }, [socket]);

    return <Toaster />;
};

export default SocketAlerts;
