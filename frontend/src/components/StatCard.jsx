import React from 'react'

const StatCard = ({ title, value }) => {
    return(
    <div className="bg-black p-4 rounded-xl shadow text-center">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
    </div>
    )
}

export default StatCard;