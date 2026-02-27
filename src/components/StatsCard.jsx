import React from 'react';

function StatsCard({ title, value, icon, color }) {
    return (
        <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
                <div>
                    <p className="text-muted mb-1 fw-bold text-uppercase small">{title}</p>
                    <h3 className="mb-0 fw-bold">{value}</h3>
                </div>
                <div className={`rounded-circle p-3 bg-${color}-subtle text-${color}`}>
                    <i className={`bi ${icon} fs-4`}></i>
                </div>
            </div>
        </div>
    );
}

export default StatsCard;