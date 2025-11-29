import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const PostureStats = ({ userId, compact = false, alwaysShow = false, isRecording = false }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [viewMode, setViewMode] = useState('daily');

  const fetchDailyStats = async (date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/posture/daily/${userId}/${dateStr}`);
      const result = await response.json();
      if (result.success && result.data) {
        // Add a timestamp to force re-render
        const dataWithTimestamp = {
          ...result.data,
          _fetchedAt: Date.now()
        };
        
        // Only update if we have actual data OR if this is the first fetch (dailyData is null)
        const hasRealData = result.data.totalGoodTime > 0 || result.data.totalBadTime > 0;
        if (hasRealData || dailyData === null) {
          setDailyData(dataWithTimestamp);
        }
      }
    } catch (error) {
      // Error fetching daily stats
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const response = await fetch(
        `/api/posture/range/${userId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const result = await response.json();
      if (result.success) {
        setWeeklyData(result.data);
      }
    } catch (error) {
      // Error fetching weekly stats
    }
  };

  const fetchCalendarData = async (year, month) => {
    try {
      const response = await fetch(`/api/posture/calendar/${userId}/${year}/${month}`);
      const result = await response.json();
      if (result.success) {
        setCalendarData(result.data);
      }
    } catch (error) {
      // Error fetching calendar data
    }
  };

  useEffect(() => {
    fetchDailyStats(selectedDate);
    fetchWeeklyStats();
    fetchCalendarData(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
  }, [userId, selectedDate]);

  useEffect(() => {
    if (!isRecording) return;

    const pollInterval = setInterval(() => {
      fetchDailyStats(selectedDate);
      fetchWeeklyStats();
    }, 5000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [isRecording, userId, selectedDate]);

  const getDailyChartData = () => {
    if (!dailyData) {
      // If alwaysShow is true, return empty data structure
      if (alwaysShow) {
        return {
          labels: ['Good Posture', 'Bad Posture'],
          datasets: [{
            label: 'Time (minutes)',
            data: [0, 0],
            backgroundColor: [
              'rgba(52, 211, 153, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
              'rgba(52, 211, 153, 1)',
              'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 2
          }]
        };
      }
      return null;
    }

    const chartData = {
      labels: ['Good Posture', 'Bad Posture'],
      datasets: [{
        label: 'Time (minutes)',
        data: [
          parseFloat((dailyData.totalGoodTime / 60000).toFixed(1)),
          parseFloat((dailyData.totalBadTime / 60000).toFixed(1))
        ],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }]
    };
    
    return chartData;
  };

  const getWeeklyChartData = () => {
    if (weeklyData.length === 0) {
      // If alwaysShow is true, return empty data structure with 7 days
      if (alwaysShow) {
        const labels = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return {
          labels,
          datasets: [{
            label: 'Good Posture %',
            data: Array(7).fill(0),
            borderColor: 'rgb(52, 211, 153)',
            backgroundColor: 'rgba(52, 211, 153, 0.2)',
            tension: 0.4,
            borderWidth: 2
          }]
        };
      }
      return null;
    }

    return {
      labels: weeklyData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Good Posture %',
        data: weeklyData.map(d => d.goodPosturePercentage.toFixed(1)),
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        tension: 0.4,
        fill: true
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 border border-slate-700/30"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayData = calendarData.find(d => 
        new Date(d.date).getDate() === day
      );
      
      const hasData = dayData?.hasData;
      const percentage = dayData?.goodPosturePercentage || 0;
      
      let bgColor = 'bg-slate-800/40';
      if (hasData) {
        if (percentage >= 80) bgColor = 'bg-green-500/30';
        else if (percentage >= 60) bgColor = 'bg-yellow-500/30';
        else bgColor = 'bg-red-500/30';
      }
      
      days.push(
        <div
          key={day}
          className={`h-16 border border-slate-700/30 ${bgColor} p-2 cursor-pointer hover:bg-slate-700/50 transition-colors`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm text-white/90">{day}</div>
          {hasData && (
            <div className="text-xs text-white/70 mt-1">
              {percentage.toFixed(0)}%
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const hasAnyData = dailyData && (dailyData.totalGoodTime > 0 || dailyData.totalBadTime > 0);
  const hasWeeklyData = weeklyData && weeklyData.length > 0;

  return (
    <div className={`bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 ${
      compact ? 'p-3' : 'p-6 rounded-2xl'
    }`}>
      {/* View Mode Selector */}
      <div className={`flex gap-1 ${compact ? 'mb-3' : 'mb-6'}`}>
        <button
          onClick={() => setViewMode('daily')}
          className={`flex-1 ${compact ? 'px-2 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg transition-colors font-medium ${
            viewMode === 'daily' 
              ? 'bg-green-500 text-white' 
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setViewMode('weekly')}
          className={`flex-1 ${compact ? 'px-2 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg transition-colors font-medium ${
            viewMode === 'weekly' 
              ? 'bg-green-500 text-white' 
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex-1 ${compact ? 'px-2 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg transition-colors font-medium ${
            viewMode === 'calendar' 
              ? 'bg-green-500 text-white' 
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Calendar
        </button>
      </div>

      {/* No Data Message */}
      {!hasAnyData && viewMode === 'daily' && !alwaysShow && (
        <div className={`text-center ${compact ? 'py-8' : 'py-16'}`}>
          <div className={`${compact ? 'text-4xl' : 'text-6xl'} mb-3`}>📊</div>
          <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white mb-2`}>No Data Yet</h3>
          <p className={`text-slate-400 ${compact ? 'text-xs mb-3' : 'text-sm mb-6'}`}>
            {compact ? 'Start recording to track posture!' : 'Start recording in the Detection page to see your posture statistics here!'}
          </p>
          <div className={`bg-slate-800/60 rounded-xl ${compact ? 'p-2' : 'p-4'} ${compact ? 'max-w-full' : 'max-w-md mx-auto'}`}>
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-slate-300 text-left`}>
              <span className="font-semibold text-green-400">How to get started:</span>
              <br />
              1. {compact ? 'Start camera' : 'Start your camera'}
              <br />
              2. Calibrate {compact ? 'height' : 'your height'}
              <br />
              3. Click "Start Recording" {compact ? 'above' : 'in Settings'}
              <br />
              4. {compact ? 'Data appears here!' : 'Maintain good posture!'}
            </p>
          </div>
        </div>
      )}

      {/* Daily View */}
      {viewMode === 'daily' && (hasAnyData || alwaysShow) && (
        <div>
          {!compact && (
            <h3 className="text-2xl font-bold text-white mb-4">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
          )}
          
          <div className={`grid ${compact ? 'grid-cols-1 gap-2 mb-3' : 'grid-cols-3 gap-4 mb-6'}`}>
            <div className={`bg-slate-800/60 rounded-lg ${compact ? 'p-2' : 'p-4'}`}>
              <div className={`text-slate-400 ${compact ? 'text-xs' : 'text-sm'} mb-1`}>Good Posture</div>
              <div className={`text-green-400 ${compact ? 'text-xl' : 'text-3xl'} font-bold`}>
                {dailyData ? dailyData.goodPosturePercentage.toFixed(1) : '0.0'}%
              </div>
            </div>
            <div className={`bg-slate-800/60 rounded-lg ${compact ? 'p-2' : 'p-4'}`}>
              <div className={`text-slate-400 ${compact ? 'text-xs' : 'text-sm'} mb-1`}>Good Time</div>
              <div className={`text-white ${compact ? 'text-lg' : 'text-2xl'} font-bold`}>
                {dailyData ? (dailyData.totalGoodTime / 60000).toFixed(1) : '0.0'} min
              </div>
            </div>
            <div className={`bg-slate-800/60 rounded-lg ${compact ? 'p-2' : 'p-4'}`}>
              <div className={`text-slate-400 ${compact ? 'text-xs' : 'text-sm'} mb-1`}>Bad Time</div>
              <div className={`text-red-400 ${compact ? 'text-lg' : 'text-2xl'} font-bold`}>
                {dailyData ? (dailyData.totalBadTime / 60000).toFixed(1) : '0.0'} min
              </div>
            </div>
          </div>

          <div className={compact ? 'h-48' : 'h-64'}>
            {getDailyChartData() ? (
              <Bar 
                key={`daily-${dailyData?._fetchedAt || Date.now()}`}
                data={getDailyChartData()} 
                options={chartOptions} 
              />
            ) : (
              <div className="text-center text-slate-400 py-12">Loading chart...</div>
            )}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {viewMode === 'weekly' && !hasWeeklyData && !alwaysShow && (
        <div className={`text-center ${compact ? 'py-8' : 'py-16'}`}>
          <div className={`${compact ? 'text-4xl' : 'text-6xl'} mb-4`}>📈</div>
          <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white mb-2`}>No Weekly Data</h3>
          <p className={`text-slate-400 ${compact ? 'text-xs' : 'text-sm'}`}>
            Record some sessions to see your 7-day trend!
          </p>
        </div>
      )}
      
      {viewMode === 'weekly' && (hasWeeklyData || alwaysShow) && (
        <div>
          {!compact && <h3 className="text-2xl font-bold text-white mb-4">Last 7 Days</h3>}
          <div className={compact ? 'h-48' : 'h-80'}>
            {getWeeklyChartData() && (
              <Line data={getWeeklyChartData()} options={chartOptions} />
            )}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
                fetchCalendarData(newDate.getFullYear(), newDate.getMonth() + 1);
              }}
              className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700"
            >
              ←
            </button>
            <h3 className="text-2xl font-bold text-white">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
                fetchCalendarData(newDate.getFullYear(), newDate.getMonth() + 1);
              }}
              className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-700"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-slate-400 text-sm font-semibold py-2">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          <div className="flex gap-4 mt-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/30 border border-green-500/50"></div>
              <span>80%+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-500/50"></div>
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/30 border border-red-500/50"></div>
              <span>&lt;60%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostureStats;
