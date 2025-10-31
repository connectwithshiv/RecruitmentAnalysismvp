import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Users, FileEdit, Mic, ClipboardCheck, UserCheck, TrendingUp, BarChart3, PieChart, Award, X, Menu, Download, RefreshCw, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const OneViewDashboard = ({ data }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    platform: 'all',
    assignTo: 'all',
    position: 'all',
    experience: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    clicks: true,
    forms: true,
    audio: true,
    eligibility: true,
    hires: true
  });

  // Filter options
  const filterOptions = useMemo(() => ({
    platforms: ['all', ...new Set(data.map(d => d.platform).filter(Boolean))],
    assignees: ['all', ...new Set(data.map(d => d.assignTo).filter(Boolean))],
    positions: ['all', ...new Set(data.map(d => d.position).filter(Boolean))],
    experiences: ['all', 'Fresher', '1-3 years', '3-5 years', '5+ years']
  }), [data]);

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (selectedFilters.platform !== 'all' && item.platform !== selectedFilters.platform) return false;
      if (selectedFilters.assignTo !== 'all' && item.assignTo !== selectedFilters.assignTo) return false;
      if (selectedFilters.position !== 'all' && item.position !== selectedFilters.position) return false;
      
      if (selectedFilters.experience !== 'all') {
        const exp = item.exp || 0;
        if (selectedFilters.experience === 'Fresher' && exp > 0) return false;
        if (selectedFilters.experience === '1-3 years' && (exp < 1 || exp > 3)) return false;
        if (selectedFilters.experience === '3-5 years' && (exp < 3 || exp > 5)) return false;
        if (selectedFilters.experience === '5+ years' && exp < 5) return false;
      }

      if (selectedFilters.dateFrom && item.dateApplyDate) {
        const filterDateFrom = new Date(selectedFilters.dateFrom);
        filterDateFrom.setHours(0, 0, 0, 0);
        const itemDate = new Date(item.dateApplyDate);
        itemDate.setHours(0, 0, 0, 0);
        if (itemDate < filterDateFrom) return false;
      }
      
      if (selectedFilters.dateTo && item.dateApplyDate) {
        const filterDateTo = new Date(selectedFilters.dateTo);
        filterDateTo.setHours(23, 59, 59, 999);
        const itemDate = new Date(item.dateApplyDate);
        itemDate.setHours(0, 0, 0, 0);
        if (itemDate > filterDateTo) return false;
      }
      
      return true;
    });
  }, [data, selectedFilters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Total Clicks (candidates with date of apply)
    const totalClicks = filteredData.filter(d => d.dateOfApply && d.dateOfApply !== '' && d.dateOfApply !== '-').length;
    
    // Total Form Fill
    const totalFormFill = filteredData.filter(d => d.jotFormFilled && d.jotFormFilled !== '' && d.jotFormFilled !== '-').length;
    
    // Total Audio Submission (Voice Note Submitted)
    const totalAudio = filteredData.filter(d => 
      d.voiceNoteSubmitted1 && d.voiceNoteSubmitted1 !== '' && d.voiceNoteSubmitted1 !== '-'
    ).length;
    
    // Total Eligibility Task Submitted
    const totalEligibility = filteredData.filter(d => 
      d.eligibilityTaskSubmitted1 && d.eligibilityTaskSubmitted1 !== '' && d.eligibilityTaskSubmitted1 !== '-'
    ).length;
    
    // Total Hire
    const totalHire = filteredData.filter(d => d.joined && d.joined !== '' && d.joined !== '-').length;

    // Helper function to create breakdown
    const createBreakdown = (filterFn, groupBy) => {
      const filtered = filteredData.filter(filterFn);
      const breakdown = {};
      
      filtered.forEach(item => {
        const key = item[groupBy] || 'Unknown';
        breakdown[key] = (breakdown[key] || 0) + 1;
      });
      
      return Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({
          name,
          count,
          percentage: filtered.length > 0 ? ((count / filtered.length) * 100).toFixed(1) : '0.0'
        }));
    };

    // Clicks breakdowns
    const clicksFilter = (d) => d.dateOfApply && d.dateOfApply !== '' && d.dateOfApply !== '-';
    const clicksByPlatform = createBreakdown(clicksFilter, 'platform');
    const clicksByPosition = createBreakdown(clicksFilter, 'position');
    const clicksByAssignee = createBreakdown(clicksFilter, 'assignTo');

    // Form fill breakdowns
    const formFilter = (d) => d.jotFormFilled && d.jotFormFilled !== '' && d.jotFormFilled !== '-';
    const formsByPlatform = createBreakdown(formFilter, 'platform');
    const formsByPosition = createBreakdown(formFilter, 'position');
    const formsByAssignee = createBreakdown(formFilter, 'assignTo');

    // Audio breakdowns
    const audioFilter = (d) => d.voiceNoteSubmitted1 && d.voiceNoteSubmitted1 !== '' && d.voiceNoteSubmitted1 !== '-';
    const audioByPlatform = createBreakdown(audioFilter, 'platform');
    const audioByPosition = createBreakdown(audioFilter, 'position');
    const audioByAssignee = createBreakdown(audioFilter, 'assignTo');

    // Eligibility breakdowns
    const eligibilityFilter = (d) => d.eligibilityTaskSubmitted1 && d.eligibilityTaskSubmitted1 !== '' && d.eligibilityTaskSubmitted1 !== '-';
    const eligibilityByPlatform = createBreakdown(eligibilityFilter, 'platform');
    const eligibilityByPosition = createBreakdown(eligibilityFilter, 'position');
    const eligibilityByAssignee = createBreakdown(eligibilityFilter, 'assignTo');

    // Hire breakdowns
    const hireFilter = (d) => d.joined && d.joined !== '' && d.joined !== '-';
    const hiresByPlatform = createBreakdown(hireFilter, 'platform');
    const hiresByPosition = createBreakdown(hireFilter, 'position');
    const hiresByAssignee = createBreakdown(hireFilter, 'assignTo');

    // Conversion rates
    const clickToFormRate = totalClicks > 0 ? ((totalFormFill / totalClicks) * 100).toFixed(1) : '0.0';
    const formToAudioRate = totalFormFill > 0 ? ((totalAudio / totalFormFill) * 100).toFixed(1) : '0.0';
    const audioToEligibilityRate = totalAudio > 0 ? ((totalEligibility / totalAudio) * 100).toFixed(1) : '0.0';
    const eligibilityToHireRate = totalEligibility > 0 ? ((totalHire / totalEligibility) * 100).toFixed(1) : '0.0';
    const overallConversionRate = totalClicks > 0 ? ((totalHire / totalClicks) * 100).toFixed(1) : '0.0';

    return {
      totalClicks,
      clicksByPlatform,
      clicksByPosition,
      clicksByAssignee,
      
      totalFormFill,
      formsByPlatform,
      formsByPosition,
      formsByAssignee,
      
      totalAudio,
      audioByPlatform,
      audioByPosition,
      audioByAssignee,
      
      totalEligibility,
      eligibilityByPlatform,
      eligibilityByPosition,
      eligibilityByAssignee,
      
      totalHire,
      hiresByPlatform,
      hiresByPosition,
      hiresByAssignee,
      
      clickToFormRate,
      formToAudioRate,
      audioToEligibilityRate,
      eligibilityToHireRate,
      overallConversionRate
    };
  }, [filteredData]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      platform: 'all',
      assignTo: 'all',
      position: 'all',
      experience: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const activeFilterCount = Object.values(selectedFilters).filter(v => v && v !== 'all').length;

  // Breakdown card component
  const BreakdownCard = ({ title, data, icon: Icon, color, maxItems = 5 }) => (
    <div className={`bg-gradient-to-br ${color} p-3 rounded-lg border-2 ${color.replace('from-', 'border-').replace('-50', '-300').split(' ')[0]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-gray-700" />
        <h4 className="text-xs font-bold text-gray-800">{title}</h4>
      </div>
      
      {data && data.length > 0 ? (
        <div className="space-y-1">
          {data.slice(0, maxItems).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white bg-opacity-60 rounded px-2 py-1">
              <span className="text-xs font-medium text-gray-800 truncate flex-1">{item.name}</span>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-xs font-bold text-gray-900">{item.count}</span>
                <span className="text-xs text-gray-600">({item.percentage}%)</span>
              </div>
            </div>
          ))}
          {data.length > maxItems && (
            <div className="text-xs text-gray-600 text-center pt-1">
              +{data.length - maxItems} more
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-gray-500 text-center py-2">No data available</div>
      )}
    </div>
  );

  // Main metric section component
  const MetricSection = ({ 
    title, 
    total, 
    icon: Icon, 
    color, 
    platformData, 
    positionData, 
    teamData,
    sectionKey,
    conversionRate,
    conversionLabel
  }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div 
          className={`bg-gradient-to-r ${color} p-3 md:p-4 cursor-pointer`}
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              <div className="bg-white bg-opacity-30 rounded-lg p-2">
                <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-bold text-white truncate">{title}</h3>
                <p className="text-xs text-white text-opacity-90">{conversionLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-right">
                <p className="text-2xl md:text-3xl font-black text-white">{total}</p>
                {conversionRate && (
                  <p className="text-xs md:text-sm font-semibold text-white text-opacity-90">{conversionRate}% conv</p>
                )}
              </div>
              <button className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors">
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Breakdown Content */}
        {isExpanded && (
          <div className="p-3 md:p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <BreakdownCard 
                title="Platform Wise" 
                data={platformData} 
                icon={BarChart3}
                color="from-blue-50 to-blue-100"
              />
              <BreakdownCard 
                title="Position Wise" 
                data={positionData} 
                icon={Award}
                color="from-purple-50 to-purple-100"
              />
              <BreakdownCard 
                title="Team Member Wise" 
                data={teamData} 
                icon={Users}
                color="from-green-50 to-green-100"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                <Eye className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-xl font-black text-gray-900 truncate">One View Dashboard</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Complete recruitment metrics at a glance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-semibold shadow-md transition-all"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm font-semibold shadow-md transition-all hidden md:flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white shadow-lg border-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-700" />
                <h3 className="text-sm font-bold text-gray-900">Filters</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filteredData.length} of {data.length} records
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-800 font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-3">
              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                <select
                  value={selectedFilters.platform}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, platform: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
                >
                  {filterOptions.platforms.map(p => (
                    <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.position}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, position: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
                >
                  {filterOptions.positions.map(p => (
                    <option key={p} value={p}>{p === 'all' ? 'All Positions' : p}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.assignTo}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, assignTo: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
                >
                  {filterOptions.assignees.map(a => (
                    <option key={a} value={a}>{a === 'all' ? 'All Team Members' : a}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.experience}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, experience: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
                >
                  {filterOptions.experiences.map(e => (
                    <option key={e} value={e}>{e === 'all' ? 'All Experience' : e}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500 hidden sm:block" />
                <label className="text-sm text-gray-700 font-semibold">Date Range:</label>
                <input
                  type="date"
                  value={selectedFilters.dateFrom}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, dateFrom: e.target.value })}
                  className="block w-full sm:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900"
                />
                <span className="text-sm text-gray-500 hidden sm:inline">to</span>
                <input
                  type="date"
                  value={selectedFilters.dateTo}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, dateTo: e.target.value })}
                  className="block w-full sm:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4">
        {/* Summary Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 shadow-lg border-2 border-blue-400">
            <p className="text-xs text-blue-100 mb-1 font-semibold">Total Clicks</p>
            <p className="text-2xl md:text-3xl font-black text-white">{metrics.totalClicks}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 shadow-lg border-2 border-green-400">
            <p className="text-xs text-green-100 mb-1 font-semibold">Form Fills</p>
            <p className="text-2xl md:text-3xl font-black text-white">{metrics.totalFormFill}</p>
            <p className="text-xs text-green-100 font-medium">{metrics.clickToFormRate}%</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 shadow-lg border-2 border-purple-400">
            <p className="text-xs text-purple-100 mb-1 font-semibold">Audio Sub</p>
            <p className="text-2xl md:text-3xl font-black text-white">{metrics.totalAudio}</p>
            <p className="text-xs text-purple-100 font-medium">{metrics.formToAudioRate}%</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-3 shadow-lg border-2 border-amber-400">
            <p className="text-xs text-amber-100 mb-1 font-semibold">Eligibility</p>
            <p className="text-2xl md:text-3xl font-black text-white">{metrics.totalEligibility}</p>
            <p className="text-xs text-amber-100 font-medium">{metrics.audioToEligibilityRate}%</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-3 shadow-lg border-2 border-red-400">
            <p className="text-xs text-red-100 mb-1 font-semibold">Total Hires</p>
            <p className="text-2xl md:text-3xl font-black text-white">{metrics.totalHire}</p>
            <p className="text-xs text-red-100 font-medium">{metrics.eligibilityToHireRate}%</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-3 shadow-lg border-2 border-indigo-400">
            <p className="text-xs text-indigo-100 mb-1 font-semibold">Overall Conv</p>
            <p className="text-2xl md:text-3xl font-black text-white">{metrics.overallConversionRate}%</p>
          </div>
        </div>

        {/* Quick Stats Matrix */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Quick Conversion Matrix
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-200">
              <p className="text-xs text-blue-800 font-semibold mb-1">Click → Form</p>
              <p className="text-xl md:text-2xl font-black text-blue-700">{metrics.clickToFormRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border-2 border-green-200">
              <p className="text-xs text-green-800 font-semibold mb-1">Form → Audio</p>
              <p className="text-xl md:text-2xl font-black text-green-700">{metrics.formToAudioRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border-2 border-purple-200">
              <p className="text-xs text-purple-800 font-semibold mb-1">Audio → Task</p>
              <p className="text-xl md:text-2xl font-black text-purple-700">{metrics.audioToEligibilityRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border-2 border-amber-200">
              <p className="text-xs text-amber-800 font-semibold mb-1">Task → Hire</p>
              <p className="text-xl md:text-2xl font-black text-amber-700">{metrics.eligibilityToHireRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border-2 border-red-200 col-span-2 md:col-span-1">
              <p className="text-xs text-red-800 font-semibold mb-1">Overall</p>
              <p className="text-xl md:text-2xl font-black text-red-700">{metrics.overallConversionRate}%</p>
            </div>
          </div>
        </div>

        {/* Detailed Metric Sections */}
        <div className="space-y-4">
          {/* Total Clicks Section */}
          <MetricSection
            title="Total Clicks (Applications)"
            total={metrics.totalClicks}
            icon={Users}
            color="from-blue-500 to-blue-600"
            platformData={metrics.clicksByPlatform}
            positionData={metrics.clicksByPosition}
            teamData={metrics.clicksByAssignee}
            sectionKey="clicks"
            conversionLabel="Data extracted and assigned"
          />

          {/* Total Form Fill Section */}
          <MetricSection
            title="Total Form Fill (Jotform)"
            total={metrics.totalFormFill}
            icon={FileEdit}
            color="from-green-500 to-green-600"
            platformData={metrics.formsByPlatform}
            positionData={metrics.formsByPosition}
            teamData={metrics.formsByAssignee}
            sectionKey="forms"
            conversionRate={metrics.clickToFormRate}
            conversionLabel="From total clicks"
          />

          {/* Total Audio Submission Section */}
          <MetricSection
            title="Total Audio Submission (Voice Notes)"
            total={metrics.totalAudio}
            icon={Mic}
            color="from-purple-500 to-purple-600"
            platformData={metrics.audioByPlatform}
            positionData={metrics.audioByPosition}
            teamData={metrics.audioByAssignee}
            sectionKey="audio"
            conversionRate={metrics.formToAudioRate}
            conversionLabel="From form fills"
          />

          {/* Total Eligibility Task Section */}
          <MetricSection
            title="Total Eligibility Task Submitted"
            total={metrics.totalEligibility}
            icon={ClipboardCheck}
            color="from-amber-500 to-amber-600"
            platformData={metrics.eligibilityByPlatform}
            positionData={metrics.eligibilityByPosition}
            teamData={metrics.eligibilityByAssignee}
            sectionKey="eligibility"
            conversionRate={metrics.audioToEligibilityRate}
            conversionLabel="From audio submissions"
          />

          {/* Total Hire Section */}
          <MetricSection
            title="Total Hire (Joined)"
            total={metrics.totalHire}
            icon={UserCheck}
            color="from-red-500 to-red-600"
            platformData={metrics.hiresByPlatform}
            positionData={metrics.hiresByPosition}
            teamData={metrics.hiresByAssignee}
            sectionKey="hires"
            conversionRate={metrics.eligibilityToHireRate}
            conversionLabel="From eligibility tasks"
          />
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2 text-white">
            <Award className="h-6 w-6 text-white" />
            Performance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-30">
              <p className="text-xs text-black mb-1 font-semibold">Best Platform</p>
              <p className="text-lg md:text-xl font-bold text-black truncate">
                {metrics.hiresByPlatform[0]?.name || 'N/A'}
              </p>
              <p className="text-xs text-white mt-1">
                {metrics.hiresByPlatform[0]?.count || 0} hires
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-30">
              <p className="text-xs text-black mb-1 font-semibold">Best Position</p>
              <p className="text-lg md:text-xl font-bold text-black truncate">
                {metrics.hiresByPosition[0]?.name || 'N/A'}
              </p>
              <p className="text-xs text-white mt-1">
                {metrics.hiresByPosition[0]?.count || 0} hires
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-30">
              <p className="text-xs text-black mb-1 font-semibold">Top Performer</p>
              <p className="text-lg md:text-xl font-bold text-black truncate">
                {metrics.hiresByAssignee[0]?.name || 'N/A'}
              </p>
              <p className="text-xs text-white mt-1">
                {metrics.hiresByAssignee[0]?.count || 0} hires
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-30">
              <p className="text-xs text-black mb-1 font-semibold">Efficiency</p>
              <p className="text-lg md:text-xl font-bold text-black">
                {metrics.overallConversionRate}%
              </p>
              <p className="text-xs text-white mt-1">
                Overall conversion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneViewDashboard;