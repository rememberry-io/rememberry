import React from 'react';

interface MapCardProps {
    map: {
        name: string;
        description: string;
    };
}

const MapCard: React.FC<MapCardProps> = ({ map }) => {
    return (
        <button>
            <div className="p-3 rounded-lg m-10">{map.name}</div>
            <div className="p-3 rounded-lg m-10">{map.description}</div>
        </button>
    );
};

export default MapCard;
