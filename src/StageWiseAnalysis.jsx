// import React, { useState, useMemo } from 'react';
// import { FaChartBar, FaFilter, FaUsers, FaCalendar, FaPhone, FaEnvelope, FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaTimes, FaChevronDown, FaChevronUp, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaLightbulb, FaClock, FaTrophy, FaChartLine, FaPercentage, FaHashtag, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// const StageWiseAnalysis = ({ data }) => {
//   const [selectedStage, setSelectedStage] = useState(null);
//   const [expandedSections, setExpandedSections] = useState({
//     demographics: true,
//     performance: true,
//     insights: true,
//     recommendations: true
//   });

//   const stages = [
//     { id: 'jobPost', name: 'Job Post', key: 'total', description: 'All candidates in system' },
//     { id: 'dataExtraction', name: 'Data Extraction', key: 'dateOfApply', description: 'Candidates with application date' },
//     { id: 'messageSent', name: 'Bulk Message Sending', key: 'messageSent', description: 'First message sent' },
//     { id: 'firstCall', name: 'First Call', key: 'firstConnectedCall', description: 'First successful call connection' },
//     { id: 'jotformSubmission', name: 'Jotform Submission', key: 'jotFormFilled', description: 'Jotform completed' },
//     { id: 'signDoc', name: 'Sign Doc Received', key: 'signDocReceived', description: 'Signed document received' },
//     { id: 'taskAssigned', name: 'Task Assigned', key: 'taskAssigned', description: 'Task assigned to candidate' },
//     { id: 'voiceNoteSubmitted', name: 'Voice Note Submitted', key: 'voiceNoteSubmitted1', description: 'Voice note submitted' },
//     { id: 'voiceNoteApproved', name: 'Voice Note Approved', key: 'voiceNoteApproved', description: 'Voice note approved' },
//     { id: 'eligibilityTaskSub', name: 'Eligibility Task Submitted', key: 'eligibilityTaskSubmitted1', description: 'Eligibility task submitted' },
//     { id: 'eligibilityApproved', name: 'Eligibility Approved', key: 'eligibilityTaskApproved', description: 'Eligibility task approved' },
//     { id: 'interviewScheduled', name: 'Interview Scheduled', key: 'interviewDoneAtOffice', description: 'Interview scheduled/done' },
//     { id: 'trialScheduled', name: 'Trial Scheduled', key: 'trialScheduled', description: 'Trial scheduled' },
//     { id: 'trialDone', name: 'Trial Done', key: 'trialDone', description: 'Trial completed' },
//     { id: 'joined', name: 'Joined', key: 'joined', description: 'Candidate joined' },
//     { id: 'worked90Days', name: 'Worked 90 Days', key: 'workedFor90Days', description: 'Completed 90 days' }
//   ];

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
//   };

//   const getCandidatesAtStage = (stageKey) => {
//     return data.filter(d => {
//       if (stageKey === 'total') return true;
//       if (stageKey === 'dateOfApply') return d.dateOfApply && d.dateOfApply !== '' && d.dateOfApply !== '-';
//       return d[stageKey] && d[stageKey] !== '' && d[stageKey] !== '-';
//     });
//   };

//   const analyzeStage = (stageKey) => {
//     const candidates = getCandidatesAtStage(stageKey);
    
//     if (candidates.length === 0) {
//       return {
//         totalCount: 0,
//         demographics: {},
//         performance: {},
//         insights: [],
//         recommendations: []
//       };
//     }

//     // Demographics Analysis
//     const platforms = {};
//     const positions = {};
//     const recruiters = {};
//     const experienceBuckets = { 'Fresher': 0, '1-3 years': 0, '3-5 years': 0, '5+ years': 0 };
//     const monthlyTrend = {};
//     const dayOfWeekTrend = {};
    
//     let totalExp = 0;
//     let expCount = 0;
//     let totalCalls = 0;
//     let totalMessages = 0;
//     let totalTouchpoints = 0;
//     let totalDaysInPipeline = 0;
//     let pipelineCount = 0;
    
//     const daysToReachStage = [];
//     const touchpointsToReachStage = [];

//     candidates.forEach(c => {
//       // Platform
//       const platform = c.platform || 'Unknown';
//       platforms[platform] = (platforms[platform] || 0) + 1;
      
//       // Position
//       const position = c.position || 'Unknown';
//       positions[position] = (positions[position] || 0) + 1;
      
//       // Recruiter
//       const recruiter = c.assignTo || 'Unassigned';
//       recruiters[recruiter] = (recruiters[recruiter] || 0) + 1;
      
//       // Experience
//       const exp = c.exp || 0;
//       if (exp > 0) {
//         totalExp += exp;
//         expCount++;
//       }
      
//       if (exp === 0) experienceBuckets['Fresher']++;
//       else if (exp > 0 && exp <= 3) experienceBuckets['1-3 years']++;
//       else if (exp > 3 && exp <= 5) experienceBuckets['3-5 years']++;
//       else experienceBuckets['5+ years']++;
      
//       // Monthly trend
//       if (c.dateApplyDate) {
//         const monthKey = `${c.dateApplyDate.getFullYear()}-${String(c.dateApplyDate.getMonth() + 1).padStart(2, '0')}`;
//         monthlyTrend[monthKey] = (monthlyTrend[monthKey] || 0) + 1;
        
//         const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//         const dayOfWeek = days[c.dateApplyDate.getDay()];
//         dayOfWeekTrend[dayOfWeek] = (dayOfWeekTrend[dayOfWeek] || 0) + 1;
//       }
      
//       // Communication metrics
//       totalCalls += c.totalCalls || 0;
//       totalMessages += c.totalMessages || 0;
//       totalTouchpoints += c.totalTouchpoints || 0;
      
//       // Pipeline metrics
//       if (c.daysInPipeline >= 0) {
//         totalDaysInPipeline += c.daysInPipeline;
//         pipelineCount++;
//       }
      
//       // Stage-specific metrics
//       if (c.dateApplyDate && c[stageKey]) {
//         const stageDate = new Date(c[stageKey]);
//         if (!isNaN(stageDate)) {
//           const days = Math.abs(stageDate - c.dateApplyDate) / (1000 * 60 * 60 * 24);
//           if (days >= 0 && days < 365) {
//             daysToReachStage.push(days);
//           }
//         }
//       }
      
//       if (c.totalTouchpoints > 0) {
//         touchpointsToReachStage.push(c.totalTouchpoints);
//       }
//     });

//     // Calculate performance metrics
//     const avgExp = expCount > 0 ? (totalExp / expCount).toFixed(2) : 0;
//     const avgCalls = candidates.length > 0 ? (totalCalls / candidates.length).toFixed(2) : 0;
//     const avgMessages = candidates.length > 0 ? (totalMessages / candidates.length).toFixed(2) : 0;
//     const avgTouchpoints = candidates.length > 0 ? (totalTouchpoints / candidates.length).toFixed(2) : 0;
//     const avgDaysInPipeline = pipelineCount > 0 ? (totalDaysInPipeline / pipelineCount).toFixed(1) : 0;
    
//     const avgDaysToStage = daysToReachStage.length > 0 
//       ? (daysToReachStage.reduce((a, b) => a + b, 0) / daysToReachStage.length).toFixed(1) 
//       : 'N/A';
    
//     const avgTouchpointsToStage = touchpointsToReachStage.length > 0
//       ? (touchpointsToReachStage.reduce((a, b) => a + b, 0) / touchpointsToReachStage.length).toFixed(1)
//       : 'N/A';

//     // Top performers
//     const topPlatform = Object.entries(platforms).sort((a, b) => b[1] - a[1])[0];
//     const topPosition = Object.entries(positions).sort((a, b) => b[1] - a[1])[0];
//     const topRecruiter = Object.entries(recruiters).sort((a, b) => b[1] - a[1])[0];
//     const topExperience = Object.entries(experienceBuckets).sort((a, b) => b[1] - a[1])[0];
//     const bestMonth = Object.entries(monthlyTrend).sort((a, b) => b[1] - a[1])[0];
//     const bestDay = Object.entries(dayOfWeekTrend).sort((a, b) => b[1] - a[1])[0];

//     // Generate insights
//     const insights = [];
    
//     // Demographics insights
//     if (topPlatform && topPlatform[1] / candidates.length > 0.5) {
//       insights.push({
//         type: 'info',
//         category: 'Source',
//         text: `${topPlatform[0]} dominates at this stage with ${((topPlatform[1] / candidates.length) * 100).toFixed(1)}% of candidates. This platform is your primary source for this stage.`
//       });
//     }
    
//     if (topExperience && topExperience[1] / candidates.length > 0.4) {
//       insights.push({
//         type: 'info',
//         category: 'Experience',
//         text: `${topExperience[0]} candidates represent ${((topExperience[1] / candidates.length) * 100).toFixed(1)}% at this stage. Your recruitment is heavily focused on this experience level.`
//       });
//     }
    
//     if (Object.keys(recruiters).length === 1) {
//       insights.push({
//         type: 'warning',
//         category: 'Workload',
//         text: `Single recruiter (${topRecruiter[0]}) handles all ${candidates.length} candidates at this stage. Consider load balancing to improve response time.`
//       });
//     }
    
//     if (avgDaysToStage !== 'N/A' && parseFloat(avgDaysToStage) > 7) {
//       insights.push({
//         type: 'warning',
//         category: 'Speed',
//         text: `Average time to reach this stage is ${avgDaysToStage} days, which exceeds the ideal 7-day target. Process acceleration needed.`
//       });
//     }
    
//     if (avgDaysToStage !== 'N/A' && parseFloat(avgDaysToStage) <= 3) {
//       insights.push({
//         type: 'success',
//         category: 'Speed',
//         text: `Excellent velocity! Candidates reach this stage in just ${avgDaysToStage} days on average. This is industry-leading performance.`
//       });
//     }
    
//     if (bestDay) {
//       insights.push({
//         type: 'info',
//         category: 'Timing',
//         text: `${bestDay[0]} is the peak day with ${bestDay[1]} candidates at this stage. Schedule key activities on this day for maximum engagement.`
//       });
//     }

//     // Generate recommendations
//     const recommendations = [];
    
//     // Platform recommendations
//     if (Object.keys(platforms).length < 3) {
//       recommendations.push({
//         priority: 'high',
//         category: 'Sourcing',
//         action: 'Diversify Platform Strategy',
//         details: `Currently using only ${Object.keys(platforms).length} platform(s). Add 2-3 more platforms to reduce dependency risk and expand reach.`,
//         expectedImpact: '+20-30% candidate volume',
//         timeline: '2-3 weeks'
//       });
//     }
    
//     if (topPlatform && topPlatform[1] / candidates.length > 0.7) {
//       recommendations.push({
//         priority: 'medium',
//         category: 'Risk Management',
//         action: 'Reduce Platform Over-Reliance',
//         details: `${topPlatform[0]} accounts for ${((topPlatform[1] / candidates.length) * 100).toFixed(1)}% of candidates. Develop backup platforms to mitigate single-source risk.`,
//         expectedImpact: 'Improved stability',
//         timeline: '1 month'
//       });
//     }
    
//     // Experience recommendations
//     if (experienceBuckets['Fresher'] / candidates.length > 0.6) {
//       recommendations.push({
//         priority: 'medium',
//         category: 'Quality Mix',
//         action: 'Balance Experience Levels',
//         details: `${((experienceBuckets['Fresher'] / candidates.length) * 100).toFixed(1)}% are freshers. Add experienced candidates for mentorship and knowledge transfer.`,
//         expectedImpact: 'Better team dynamics',
//         timeline: 'Ongoing'
//       });
//     }
    
//     // Speed recommendations
//     if (avgDaysToStage !== 'N/A' && parseFloat(avgDaysToStage) > 5) {
//       recommendations.push({
//         priority: 'high',
//         category: 'Process Speed',
//         action: 'Accelerate Stage Progression',
//         details: `Current average of ${avgDaysToStage} days to reach stage. Implement automated reminders at 24h, 48h, and 72h intervals.`,
//         expectedImpact: `Reduce to ${(parseFloat(avgDaysToStage) * 0.6).toFixed(1)} days`,
//         timeline: '1-2 weeks'
//       });
//     }
    
//     // Communication recommendations
//     if (parseFloat(avgTouchpoints) < 3 && stageKey !== 'total') {
//       recommendations.push({
//         priority: 'medium',
//         category: 'Engagement',
//         action: 'Increase Touchpoints',
//         details: `Only ${avgTouchpoints} average touchpoints per candidate. Industry best practice is 5-7 touchpoints for optimal engagement.`,
//         expectedImpact: '+15-25% conversion',
//         timeline: '2 weeks'
//       });
//     }
    
//     // Workload recommendations
//     if (Object.keys(recruiters).length > 1) {
//       const recruiterCounts = Object.values(recruiters);
//       const maxLoad = Math.max(...recruiterCounts);
//       const minLoad = Math.min(...recruiterCounts);
//       if (maxLoad / minLoad > 2) {
//         recommendations.push({
//           priority: 'medium',
//           category: 'Resource Allocation',
//           action: 'Balance Recruiter Workload',
//           details: `Workload variance is ${maxLoad - minLoad} candidates. Redistribute for equal load distribution and consistent service quality.`,
//           expectedImpact: 'Better response times',
//           timeline: 'Immediate'
//         });
//       }
//     }
    
//     // Quality recommendations
//     if (avgExp !== 0 && parseFloat(avgExp) < 2) {
//       recommendations.push({
//         priority: 'low',
//         category: 'Quality',
//         action: 'Target More Experienced Candidates',
//         details: `Average experience is ${avgExp} years. Consider targeting 2-4 year experienced candidates for faster productivity.`,
//         expectedImpact: 'Reduced training time',
//         timeline: 'Next cycle'
//       });
//     }

//     return {
//       totalCount: candidates.length,
//       demographics: {
//         platforms,
//         positions,
//         recruiters,
//         experienceBuckets,
//         monthlyTrend,
//         dayOfWeekTrend,
//         avgExp,
//         topPlatform,
//         topPosition,
//         topRecruiter,
//         topExperience,
//         bestMonth,
//         bestDay
//       },
//       performance: {
//         avgCalls,
//         avgMessages,
//         avgTouchpoints,
//         avgDaysInPipeline,
//         avgDaysToStage,
//         avgTouchpointsToStage,
//         totalCalls,
//         totalMessages,
//         totalTouchpoints
//       },
//       insights,
//       recommendations
//     };
//   };

//   const currentAnalysis = selectedStage ? analyzeStage(selectedStage.key) : null;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 md:p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
//                 <FaChartBar className="text-blue-600" />
//                 Stage-wise Deep Analysis
//               </h1>
//               <p className="text-gray-600 mt-2">Comprehensive characteristics, analytics, and insights for each recruitment stage</p>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Total Candidates</p>
//               <p className="text-3xl font-bold text-blue-600">{data.length}</p>
//             </div>
//           </div>
//         </div>

//         {/* Stage Selection */}
//         <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 md:p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <FaFilter className="text-gray-600" />
//             <h2 className="text-xl font-semibold text-gray-900">Select Stage for Analysis</h2>
//           </div>
          
//           <div className="grid grid-cols-4 gap-3">
//             {stages.map((stage, idx) => {
//               const stageData = analyzeStage(stage.key);
//               const isSelected = selectedStage?.id === stage.id;
              
//               return (
//                 <button
//                   key={stage.id}
//                   onClick={() => setSelectedStage(stage)}
//                   className={`p-4 rounded-lg border-2 transition-all text-left ${
//                     isSelected 
//                       ? 'border-blue-500 bg-blue-50 shadow-lg' 
//                       : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-xs font-bold text-gray-500">Stage {idx + 1}</span>
//                     <span className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
//                       {stageData.totalCount}
//                     </span>
//                   </div>
//                   <p className="text-sm font-semibold text-gray-900 mb-1">{stage.name}</p>
//                   <p className="text-xs text-gray-500">{stage.description}</p>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Analysis Content */}
//         {selectedStage && currentAnalysis && (
//           <div className="space-y-6">
//             {/* Stage Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">{selectedStage.name}</h2>
//                   <p className="text-blue-100">{selectedStage.description}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedStage(null)}
//                   className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
//                 >
//                   <FaTimes className="text-xl" />
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-5 gap-4 mt-6">
//                 <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
//                   <FaUsers className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Total Candidates</p>
//                   <p className="text-3xl font-bold">{currentAnalysis.totalCount}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
//                   <FaPhone className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Avg Calls</p>
//                   <p className="text-3xl font-bold">{currentAnalysis.performance.avgCalls}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
//                   <FaEnvelope className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Avg Messages</p>
//                   <p className="text-3xl font-bold">{currentAnalysis.performance.avgMessages}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
//                   <FaClock className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Days to Stage</p>
//                   <p className="text-3xl font-bold">{currentAnalysis.performance.avgDaysToStage}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
//                   <FaGraduationCap className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Avg Experience</p>
//                   <p className="text-3xl font-bold">{currentAnalysis.demographics.avgExp}y</p>
//                 </div>
//               </div>
//             </div>

//             {/* Demographics Section */}
//             <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
//               <button
//                 onClick={() => toggleSection('demographics')}
//                 className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <FaUsers className="text-2xl text-blue-600" />
//                   <h3 className="text-xl font-semibold text-gray-900">Demographics & Characteristics</h3>
//                 </div>
//                 {expandedSections.demographics ? <FaChevronUp /> : <FaChevronDown />}
//               </button>
              
//               {expandedSections.demographics && (
//                 <div className="p-6 border-t border-gray-200 space-y-6">
//                   {/* Platform Distribution */}
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                       <FaMapMarkerAlt className="text-blue-600" />
//                       Platform Distribution
//                     </h4>
//                     <div className="grid grid-cols-3 gap-3">
//                       {Object.entries(currentAnalysis.demographics.platforms)
//                         .sort((a, b) => b[1] - a[1])
//                         .map(([platform, count]) => (
//                           <div key={platform} className="bg-white rounded p-3">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium text-gray-700">{platform}</span>
//                               <span className="text-lg font-bold text-blue-600">{count}</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                               <div 
//                                 className="bg-blue-600 h-2 rounded-full transition-all"
//                                 style={{ width: `${(count / currentAnalysis.totalCount) * 100}%` }}
//                               />
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {((count / currentAnalysis.totalCount) * 100).toFixed(1)}%
//                             </p>
//                           </div>
//                         ))}
//                     </div>
//                     {currentAnalysis.demographics.topPlatform && (
//                       <div className="mt-4 p-3 bg-green-100 rounded flex items-center gap-2">
//                         <FaTrophy className="text-green-600" />
//                         <span className="text-sm font-medium text-green-800">
//                           Top Platform: <strong>{currentAnalysis.demographics.topPlatform[0]}</strong> with {currentAnalysis.demographics.topPlatform[1]} candidates
//                           ({((currentAnalysis.demographics.topPlatform[1] / currentAnalysis.totalCount) * 100).toFixed(1)}%)
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Position Distribution */}
//                   <div className="bg-purple-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                       <FaBriefcase className="text-purple-600" />
//                       Position Distribution
//                     </h4>
//                     <div className="grid grid-cols-3 gap-3">
//                       {Object.entries(currentAnalysis.demographics.positions)
//                         .sort((a, b) => b[1] - a[1])
//                         .slice(0, 6)
//                         .map(([position, count]) => (
//                           <div key={position} className="bg-white rounded p-3">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium text-gray-700 truncate">{position}</span>
//                               <span className="text-lg font-bold text-purple-600">{count}</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-2">
//                               <div 
//                                 className="bg-purple-600 h-2 rounded-full transition-all"
//                                 style={{ width: `${(count / currentAnalysis.totalCount) * 100}%` }}
//                               />
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {((count / currentAnalysis.totalCount) * 100).toFixed(1)}%
//                             </p>
//                           </div>
//                         ))}
//                     </div>
//                   </div>

//                   {/* Experience Distribution */}
//                   <div className="bg-green-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                       <FaGraduationCap className="text-green-600" />
//                       Experience Level Distribution
//                     </h4>
//                     <div className="grid grid-cols-4 gap-3">
//                       {Object.entries(currentAnalysis.demographics.experienceBuckets).map(([level, count]) => (
//                         <div key={level} className="bg-white rounded p-4 text-center">
//                           <p className="text-sm text-gray-600 mb-2">{level}</p>
//                           <p className="text-3xl font-bold text-green-600 mb-2">{count}</p>
//                           <p className="text-xs text-gray-500">
//                             {((count / currentAnalysis.totalCount) * 100).toFixed(1)}%
//                           </p>
//                           <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//                             <div 
//                               className="bg-green-600 h-2 rounded-full transition-all"
//                               style={{ width: `${(count / currentAnalysis.totalCount) * 100}%` }}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="mt-4 grid grid-cols-2 gap-3">
//                       <div className="bg-white rounded p-3">
//                         <p className="text-sm text-gray-600">Average Experience</p>
//                         <p className="text-2xl font-bold text-green-600">{currentAnalysis.demographics.avgExp} years</p>
//                       </div>
//                       {currentAnalysis.demographics.topExperience && (
//                         <div className="bg-white rounded p-3">
//                           <p className="text-sm text-gray-600">Most Common</p>
//                           <p className="text-2xl font-bold text-green-600">{currentAnalysis.demographics.topExperience[0]}</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Recruiter Distribution */}
//                   <div className="bg-amber-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                       <FaUsers className="text-amber-600" />
//                       Recruiter Workload
//                     </h4>
//                     <div className="space-y-2">
//                       {Object.entries(currentAnalysis.demographics.recruiters)
//                         .sort((a, b) => b[1] - a[1])
//                         .map(([recruiter, count]) => (
//                           <div key={recruiter} className="bg-white rounded p-3">
//                             <div className="flex justify-between items-center mb-2">
//                               <span className="text-sm font-medium text-gray-700">{recruiter}</span>
//                               <span className="text-lg font-bold text-amber-600">{count} candidates</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-3">
//                               <div 
//                                 className="bg-amber-600 h-3 rounded-full transition-all"
//                                 style={{ width: `${(count / currentAnalysis.totalCount) * 100}%` }}
//                               />
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                               {((count / currentAnalysis.totalCount) * 100).toFixed(1)}% of stage workload
//                             </p>
//                           </div>
//                         ))}
//                     </div>
//                   </div>

//                   {/* Timing Analysis */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-indigo-50 rounded-lg p-4">
//                       <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                         <FaCalendar className="text-indigo-600" />
//                         Monthly Trend
//                       </h4>
//                       <div className="space-y-2">
//                         {Object.entries(currentAnalysis.demographics.monthlyTrend)
//                           .sort((a, b) => b[0].localeCompare(a[0]))
//                           .slice(0, 6)
//                           .map(([month, count]) => (
//                             <div key={month} className="bg-white rounded p-2 flex justify-between items-center">
//                               <span className="text-sm font-medium text-gray-700">{month}</span>
//                               <span className="text-lg font-bold text-indigo-600">{count}</span>
//                             </div>
//                           ))}
//                       </div>
//                     </div>

//                     <div className="bg-teal-50 rounded-lg p-4">
//                       <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                         <FaCalendar className="text-teal-600" />
//                         Day of Week Pattern
//                       </h4>
//                       <div className="space-y-2">
//                         {Object.entries(currentAnalysis.demographics.dayOfWeekTrend)
//                           .sort((a, b) => b[1] - a[1])
//                           .map(([day, count]) => (
//                             <div key={day} className="bg-white rounded p-2">
//                               <div className="flex justify-between items-center mb-1">
//                                 <span className="text-sm font-medium text-gray-700">{day}</span>
//                                 <span className="text-lg font-bold text-teal-600">{count}</span>
//                               </div>
//                               <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div 
//                                   className="bg-teal-600 h-2 rounded-full"
//                                   style={{ width: `${(count / currentAnalysis.totalCount) * 100}%` }}
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                       {currentAnalysis.demographics.bestDay && (
//                         <div className="mt-3 p-2 bg-teal-100 rounded text-center">
//                           <FaTrophy className="inline text-teal-600 mr-2" />
//                           <span className="text-sm font-medium text-teal-800">
//                             Peak Day: <strong>{currentAnalysis.demographics.bestDay[0]}</strong>
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Performance Metrics Section */}
//             <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
//               <button
//                 onClick={() => toggleSection('performance')}
//                 className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <FaChartLine className="text-2xl text-green-600" />
//                   <h3 className="text-xl font-semibold text-gray-900">Performance Metrics</h3>
//                 </div>
//                 {expandedSections.performance ? <FaChevronUp /> : <FaChevronDown />}
//               </button>
              
//               {expandedSections.performance && (
//                 <div className="p-6 border-t border-gray-200 space-y-6">
//                   {/* Key Performance Indicators */}
//                   <div className="grid grid-cols-4 gap-4">
//                     <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
//                       <FaPhone className="text-2xl mb-2 opacity-80" />
//                       <p className="text-sm opacity-90 mb-1">Total Calls Made</p>
//                       <p className="text-3xl font-bold">{currentAnalysis.performance.totalCalls}</p>
//                       <p className="text-xs opacity-75 mt-2">Avg: {currentAnalysis.performance.avgCalls} per candidate</p>
//                     </div>

//                     <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
//                       <FaEnvelope className="text-2xl mb-2 opacity-80" />
//                       <p className="text-sm opacity-90 mb-1">Total Messages Sent</p>
//                       <p className="text-3xl font-bold">{currentAnalysis.performance.totalMessages}</p>
//                       <p className="text-xs opacity-75 mt-2">Avg: {currentAnalysis.performance.avgMessages} per candidate</p>
//                     </div>

//                     <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
//                       <FaHashtag className="text-2xl mb-2 opacity-80" />
//                       <p className="text-sm opacity-90 mb-1">Total Touchpoints</p>
//                       <p className="text-3xl font-bold">{currentAnalysis.performance.totalTouchpoints}</p>
//                       <p className="text-xs opacity-75 mt-2">Avg: {currentAnalysis.performance.avgTouchpoints} per candidate</p>
//                     </div>

//                     <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
//                       <FaClock className="text-2xl mb-2 opacity-80" />
//                       <p className="text-sm opacity-90 mb-1">Avg Days in Pipeline</p>
//                       <p className="text-3xl font-bold">{currentAnalysis.performance.avgDaysInPipeline}d</p>
//                       <p className="text-xs opacity-75 mt-2">Since application date</p>
//                     </div>
//                   </div>

//                   {/* Stage-Specific Metrics */}
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <FaPercentage className="text-indigo-600" />
//                       Stage-Specific Performance
//                     </h4>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-white rounded-lg p-4 border border-indigo-200">
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm text-gray-600">Average Days to Reach Stage</span>
//                           <FaClock className="text-indigo-600" />
//                         </div>
//                         <p className="text-3xl font-bold text-indigo-600">{currentAnalysis.performance.avgDaysToStage}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {currentAnalysis.performance.avgDaysToStage !== 'N/A' && parseFloat(currentAnalysis.performance.avgDaysToStage) <= 3 
//                             ? '🚀 Excellent velocity!' 
//                             : currentAnalysis.performance.avgDaysToStage !== 'N/A' && parseFloat(currentAnalysis.performance.avgDaysToStage) > 7
//                             ? '⚠️ Needs acceleration'
//                             : 'Within acceptable range'}
//                         </p>
//                       </div>

//                       <div className="bg-white rounded-lg p-4 border border-green-200">
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm text-gray-600">Avg Touchpoints to Stage</span>
//                           <FaHashtag className="text-green-600" />
//                         </div>
//                         <p className="text-3xl font-bold text-green-600">{currentAnalysis.performance.avgTouchpointsToStage}</p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {currentAnalysis.performance.avgTouchpointsToStage !== 'N/A' && parseFloat(currentAnalysis.performance.avgTouchpointsToStage) >= 5
//                             ? '✓ Good engagement'
//                             : currentAnalysis.performance.avgTouchpointsToStage !== 'N/A' && parseFloat(currentAnalysis.performance.avgTouchpointsToStage) < 3
//                             ? '⚠️ Increase touchpoints'
//                             : 'Moderate engagement'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Efficiency Metrics */}
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <FaChartBar className="text-blue-600" />
//                       Efficiency Analysis
//                     </h4>
//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="bg-white rounded-lg p-3 text-center">
//                         <p className="text-xs text-gray-600 mb-1">Call Efficiency</p>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {currentAnalysis.performance.totalCalls > 0 
//                             ? ((currentAnalysis.totalCount / currentAnalysis.performance.totalCalls) * 100).toFixed(1)
//                             : 0}%
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">Candidates per call</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 text-center">
//                         <p className="text-xs text-gray-600 mb-1">Message Efficiency</p>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {currentAnalysis.performance.totalMessages > 0 
//                             ? ((currentAnalysis.totalCount / currentAnalysis.performance.totalMessages) * 100).toFixed(1)
//                             : 0}%
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">Candidates per message</p>
//                       </div>

//                       <div className="bg-white rounded-lg p-3 text-center">
//                         <p className="text-xs text-gray-600 mb-1">Overall Efficiency</p>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {currentAnalysis.performance.totalTouchpoints > 0 
//                             ? ((currentAnalysis.totalCount / currentAnalysis.performance.totalTouchpoints) * 100).toFixed(1)
//                             : 0}%
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">Candidates per touchpoint</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Insights Section */}
//             <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
//               <button
//                 onClick={() => toggleSection('insights')}
//                 className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <FaInfoCircle className="text-2xl text-purple-600" />
//                   <h3 className="text-xl font-semibold text-gray-900">Key Insights</h3>
//                   <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-semibold">
//                     {currentAnalysis.insights.length} insights
//                   </span>
//                 </div>
//                 {expandedSections.insights ? <FaChevronUp /> : <FaChevronDown />}
//               </button>
              
//               {expandedSections.insights && (
//                 <div className="p-6 border-t border-gray-200">
//                   {currentAnalysis.insights.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       <FaInfoCircle className="text-4xl mx-auto mb-3 opacity-50" />
//                       <p>No specific insights available for this stage yet.</p>
//                       <p className="text-sm mt-2">Continue collecting data for better analysis.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {currentAnalysis.insights.map((insight, idx) => (
//                         <div 
//                           key={idx}
//                           className={`rounded-lg p-4 border-l-4 ${
//                             insight.type === 'success' 
//                               ? 'bg-green-50 border-green-500' 
//                               : insight.type === 'warning'
//                               ? 'bg-amber-50 border-amber-500'
//                               : 'bg-blue-50 border-blue-500'
//                           }`}
//                         >
//                           <div className="flex items-start gap-3">
//                             {insight.type === 'success' && <FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-1" />}
//                             {insight.type === 'warning' && <FaExclamationTriangle className="text-amber-600 text-xl flex-shrink-0 mt-1" />}
//                             {insight.type === 'info' && <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-1" />}
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className={`text-xs font-bold px-2 py-1 rounded ${
//                                   insight.type === 'success' 
//                                     ? 'bg-green-200 text-green-800' 
//                                     : insight.type === 'warning'
//                                     ? 'bg-amber-200 text-amber-800'
//                                     : 'bg-blue-200 text-blue-800'
//                                 }`}>
//                                   {insight.category}
//                                 </span>
//                               </div>
//                               <p className={`text-sm font-medium ${
//                                 insight.type === 'success' 
//                                   ? 'text-green-900' 
//                                   : insight.type === 'warning'
//                                   ? 'text-amber-900'
//                                   : 'text-blue-900'
//                               }`}>
//                                 {insight.text}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Recommendations Section */}
//             <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
//               <button
//                 onClick={() => toggleSection('recommendations')}
//                 className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <FaLightbulb className="text-2xl text-amber-600" />
//                   <h3 className="text-xl font-semibold text-gray-900">Action Recommendations</h3>
//                   <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-semibold">
//                     {currentAnalysis.recommendations.length} actions
//                   </span>
//                 </div>
//                 {expandedSections.recommendations ? <FaChevronUp /> : <FaChevronDown />}
//               </button>
              
//               {expandedSections.recommendations && (
//                 <div className="p-6 border-t border-gray-200">
//                   {currentAnalysis.recommendations.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       <FaCheckCircle className="text-4xl mx-auto mb-3 text-green-500" />
//                       <p className="font-semibold text-gray-700">Stage is performing well!</p>
//                       <p className="text-sm mt-2">No critical recommendations at this time.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {currentAnalysis.recommendations.map((rec, idx) => (
//                         <div 
//                           key={idx}
//                           className={`rounded-lg p-5 border-2 ${
//                             rec.priority === 'high' 
//                               ? 'bg-red-50 border-red-300' 
//                               : rec.priority === 'medium'
//                               ? 'bg-amber-50 border-amber-300'
//                               : 'bg-blue-50 border-blue-300'
//                           }`}
//                         >
//                           <div className="flex items-start gap-4">
//                             <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
//                               rec.priority === 'high' 
//                                 ? 'bg-red-200' 
//                                 : rec.priority === 'medium'
//                                 ? 'bg-amber-200'
//                                 : 'bg-blue-200'
//                             }`}>
//                               {rec.priority === 'high' && <FaExclamationTriangle className="text-red-700 text-xl" />}
//                               {rec.priority === 'medium' && <FaInfoCircle className="text-amber-700 text-xl" />}
//                               {rec.priority === 'low' && <FaLightbulb className="text-blue-700 text-xl" />}
//                             </div>
                            
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-2">
//                                 <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
//                                   rec.priority === 'high' 
//                                     ? 'bg-red-200 text-red-800' 
//                                     : rec.priority === 'medium'
//                                     ? 'bg-amber-200 text-amber-800'
//                                     : 'bg-blue-200 text-blue-800'
//                                 }`}>
//                                   {rec.priority} Priority
//                                 </span>
//                                 <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
//                                   {rec.category}
//                                 </span>
//                               </div>
                              
//                               <h4 className={`text-lg font-bold mb-2 ${
//                                 rec.priority === 'high' 
//                                   ? 'text-red-900' 
//                                   : rec.priority === 'medium'
//                                   ? 'text-amber-900'
//                                   : 'text-blue-900'
//                               }`}>
//                                 {rec.action}
//                               </h4>
                              
//                               <p className={`text-sm mb-3 ${
//                                 rec.priority === 'high' 
//                                   ? 'text-red-800' 
//                                   : rec.priority === 'medium'
//                                   ? 'text-amber-800'
//                                   : 'text-blue-800'
//                               }`}>
//                                 {rec.details}
//                               </p>
                              
//                               <div className="grid grid-cols-2 gap-3">
//                                 <div className="bg-white rounded p-2">
//                                   <div className="flex items-center gap-2 mb-1">
//                                     <FaArrowUp className="text-green-600 text-sm" />
//                                     <span className="text-xs text-gray-600 font-semibold">Expected Impact</span>
//                                   </div>
//                                   <p className="text-sm font-bold text-green-700">{rec.expectedImpact}</p>
//                                 </div>
                                
//                                 <div className="bg-white rounded p-2">
//                                   <div className="flex items-center gap-2 mb-1">
//                                     <FaClock className="text-blue-600 text-sm" />
//                                     <span className="text-xs text-gray-600 font-semibold">Timeline</span>
//                                   </div>
//                                   <p className="text-sm font-bold text-blue-700">{rec.timeline}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Summary Card */}
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
//               <h3 className="text-xl font-bold mb-4">Stage Summary</h3>
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
//                   <FaUsers className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Total at Stage</p>
//                   <p className="text-2xl font-bold">{currentAnalysis.totalCount}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
//                   <FaChartLine className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Insights Found</p>
//                   <p className="text-2xl font-bold">{currentAnalysis.insights.length}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
//                   <FaLightbulb className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Actions Suggested</p>
//                   <p className="text-2xl font-bold">{currentAnalysis.recommendations.length}</p>
//                 </div>
//                 <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
//                   <FaTrophy className="text-2xl mb-2" />
//                   <p className="text-sm opacity-90">Top Platform</p>
//                   <p className="text-lg font-bold truncate">
//                     {currentAnalysis.demographics.topPlatform ? currentAnalysis.demographics.topPlatform[0] : 'N/A'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Instructions when no stage selected */}
//         {!selectedStage && (
//           <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 md:p-12 text-center">
//             <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Stage to Begin Analysis</h3>
//             <p className="text-gray-600 mb-6">Choose any stage above to view comprehensive demographics, performance metrics, insights, and actionable recommendations.</p>
//             <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
//               <div className="bg-blue-50 rounded-lg p-4">
//                 <FaUsers className="text-2xl text-blue-600 mb-2" />
//                 <h4 className="font-semibold text-gray-900 mb-1">Demographics</h4>
//                 <p className="text-sm text-gray-600">Complete candidate characteristics including platform, position, experience, and timing patterns.</p>
//               </div>
//               <div className="bg-green-50 rounded-lg p-4">
//                 <FaChartLine className="text-2xl text-green-600 mb-2" />
//                 <h4 className="font-semibold text-gray-900 mb-1">Performance</h4>
//                 <p className="text-sm text-gray-600">Detailed metrics on communication, touchpoints, efficiency, and stage velocity.</p>
//               </div>
//               <div className="bg-amber-50 rounded-lg p-4">
//                 <FaLightbulb className="text-2xl text-amber-600 mb-2" />
//                 <h4 className="font-semibold text-gray-900 mb-1">Recommendations</h4>
//                 <p className="text-sm text-gray-600">Data-driven action plans with priority, impact projections, and timelines.</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StageWiseAnalysis;

import React, { useState, useMemo } from 'react';
import { FaChartBar, FaFilter, FaUsers, FaCalendar, FaPhone, FaEnvelope, FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaTimes, FaChevronDown, FaChevronUp, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaLightbulb, FaClock, FaTrophy, FaChartLine, FaPercentage, FaHashtag, FaArrowUp, FaArrowDown, FaUserTie, FaBuilding, FaClipboardList, FaStar, FaFire, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const StageWiseAnalysis = ({ data }) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    demographics: true,
    positionAnalysis: true,
    recruiterAnalysis: true,
    platformStrategy: true,
    performance: true,
    insights: true,
    recommendations: true
  });

  const stages = [
    { id: 'dataExtraction', name: 'Data Extraction', key: 'dateApplyDate', description: 'Candidates with application date' },
    { id: 'messageSent', name: 'Bulk Message Sending', key: 'messageSent', description: 'First message sent' },
    { id: 'firstCall', name: 'First Call', key: 'firstConnectedCall', description: 'First successful call connection' },
    { id: 'jotformSubmission', name: 'Jotform Submission', key: 'jotFormFilled', description: 'Jotform completed' },
    { id: 'audioSubmission', name: 'Audio Submission', key: 'audioSubmission', description: 'Audio submitted' },
    { id: 'audioApproved', name: 'Audio Approved', key: 'revisedAudioApproved', description: 'Audio approved' },
    { id: 'eligibilityTaskSub', name: 'Eligibility Task Submitted', key: 'eligibilityTaskSubmission', description: 'Eligibility task submitted' },
    { id: 'eligibilityApproved', name: 'Eligibility Approved', key: 'eligibilityTaskApproval', description: 'Eligibility task approved' },
    { id: 'signDocSent', name: 'Sign Doc Sent', key: 'signingDocWithoutRatesSent', description: 'Documents sent (Without Rates)' },
    { id: 'signDocReceived', name: 'Sign Doc Received', key: 'signingDocWithoutRatesReceived', description: 'Documents received (Without Rates)' },
    { id: 'signDocWithRates', name: 'Sign Doc With Rates', key: 'signingDocWithRatesReceived', description: 'Documents received (With Rates)' },
    { id: 'onboarded', name: 'Onboarded', key: 'onboardingTaskAssignment', description: 'Task assigned to candidate' },
    { id: 'paymentFollowup', name: 'Payment Follow-up', key: 'message7Days', description: '7-day payment follow-up' },
    { id: 'writeupAssigned', name: 'Write-up Assigned', key: 'message15Days', description: 'Write-up work assigned' },
    { id: 'checkingAssigned', name: 'Checking Assigned', key: 'message30Days', description: 'Checking work assigned' },
    { id: 'teamManagement', name: 'Team Management', key: 'message45Days', description: 'Team management assigned' },
    { id: 'scaling', name: 'Scaling Team', key: 'messageDoubleTeam', description: 'Scaling team members' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter data by date range
  const filteredData = useMemo(() => {
    if (!dateFrom && !dateTo) return data;
    
    return data.filter(d => {
      // Use the parsed date object from the API (dateApplyDate)
      if (!d.dateApplyDate) return false;
      
      const recordDate = d.dateApplyDate;
      const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;
      
      if (fromDate && recordDate < fromDate) return false;
      if (toDate && recordDate > toDate) return false;
      
      return true;
    });
  }, [data, dateFrom, dateTo]);

  const getCandidatesAtStage = (stageKey) => {
    return filteredData.filter(d => {
      if (stageKey === 'total') return true;
      if (stageKey === 'dateOfApply') return d.dateApplyDate && d.dateApplyDate !== null;
      return d[stageKey] && d[stageKey] !== '' && d[stageKey] !== '-';
    });
  };

  const analyzeStage = (stageKey) => {
    const candidates = getCandidatesAtStage(stageKey);
    
    if (candidates.length === 0) {
      return {
        totalCount: 0,
        demographics: {},
        positionAnalysis: {},
        recruiterAnalysis: {},
        platformStrategy: {},
        performance: {},
        insights: [],
        recommendations: []
      };
    }

    const platforms = {};
    const positions = {};
    const recruiters = {};
    const experienceBuckets = { 'Fresher (0y)': 0, '1-2 years': 0, '2-3 years': 0, '3-5 years': 0, '5+ years': 0 };
    const ageGroups = { '18-25': 0, '26-30': 0, '31-35': 0, '36-40': 0, '40+': 0, 'Unknown': 0 };
    const genderDistribution = { 'Male': 0, 'Female': 0, 'Other': 0, 'Unknown': 0 };
    const locationDistribution = {};
    const educationLevels = {};
    const monthlyTrend = {};
    const dayOfWeekTrend = {};
    
    let totalExp = 0, expCount = 0, totalCalls = 0, totalMessages = 0, totalTouchpoints = 0;
    let totalDaysInPipeline = 0, pipelineCount = 0;
    
    const daysToReachStage = [], touchpointsToReachStage = [], experienceValues = [];
    const positionDetails = {};
    const recruiterDetails = {};
    const platformPositionMatrix = {};

    candidates.forEach(c => {
      const platform = c.platform || 'Unknown';
      platforms[platform] = (platforms[platform] || 0) + 1;
      
      const position = c.position || 'Unknown';
      positions[position] = (positions[position] || 0) + 1;
      
      if (!positionDetails[position]) {
        positionDetails[position] = {
          total: 0,
          platforms: {},
          recruiters: {},
          avgExp: 0,
          experiences: [],
          avgDaysToStage: [],
          conversionToNext: 0,
          avgCalls: 0,
          avgMessages: 0,
          locations: {},
          education: {},
          ageGroups: {}
        };
      }
      positionDetails[position].total++;
      positionDetails[position].platforms[platform] = (positionDetails[position].platforms[platform] || 0) + 1;
      
      const recruiter = c.assignTo || 'Unassigned';
      recruiters[recruiter] = (recruiters[recruiter] || 0) + 1;
      
      if (!recruiterDetails[recruiter]) {
        recruiterDetails[recruiter] = {
          total: 0,
          positions: {},
          platforms: {},
          avgExp: 0,
          experiences: [],
          avgDaysToStage: [],
          avgResponseTime: [],
          totalCalls: 0,
          totalMessages: 0,
          successRate: 0,
          candidatesConverted: 0
        };
      }
      recruiterDetails[recruiter].total++;
      recruiterDetails[recruiter].positions[position] = (recruiterDetails[recruiter].positions[position] || 0) + 1;
      recruiterDetails[recruiter].platforms[platform] = (recruiterDetails[recruiter].platforms[platform] || 0) + 1;
      
      const matrixKey = `${platform}|${position}`;
      if (!platformPositionMatrix[matrixKey]) {
        platformPositionMatrix[matrixKey] = {
          platform,
          position,
          count: 0,
          avgExp: 0,
          experiences: [],
          conversionRate: 0,
          avgDaysToStage: []
        };
      }
      platformPositionMatrix[matrixKey].count++;
      
      const exp = c.exp || 0;
      if (exp > 0) {
        totalExp += exp;
        expCount++;
        experienceValues.push(exp);
        positionDetails[position].experiences.push(exp);
        recruiterDetails[recruiter].experiences.push(exp);
        platformPositionMatrix[matrixKey].experiences.push(exp);
      }
      
      if (exp === 0) experienceBuckets['Fresher (0y)']++;
      else if (exp > 0 && exp <= 2) experienceBuckets['1-2 years']++;
      else if (exp > 2 && exp <= 3) experienceBuckets['2-3 years']++;
      else if (exp > 3 && exp <= 5) experienceBuckets['3-5 years']++;
      else experienceBuckets['5+ years']++;
      
      ageGroups['Unknown']++;
      
      const gender = c.gender || 'Unknown';
      genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;
      
      const location = c.location || c.city || 'Unknown';
      locationDistribution[location] = (locationDistribution[location] || 0) + 1;
      
      const education = c.education || c.qualification || 'Unknown';
      educationLevels[education] = (educationLevels[education] || 0) + 1;
      
      if (c.dateOfApply) {
        const dateObj = new Date(c.dateOfApply);
        const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        monthlyTrend[monthKey] = (monthlyTrend[monthKey] || 0) + 1;
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[dateObj.getDay()];
        dayOfWeekTrend[dayOfWeek] = (dayOfWeekTrend[dayOfWeek] || 0) + 1;
      }
      
      const calls = c.totalCalls || 0;
      const messages = c.totalMessages || 0;
      totalCalls += calls;
      totalMessages += messages;
      totalTouchpoints += c.totalTouchpoints || 0;
      
      positionDetails[position].avgCalls += calls;
      positionDetails[position].avgMessages += messages;
      recruiterDetails[recruiter].totalCalls += calls;
      recruiterDetails[recruiter].totalMessages += messages;
      
      if (c.daysInPipeline >= 0) {
        totalDaysInPipeline += c.daysInPipeline;
        pipelineCount++;
      }
      
      if (c.dateOfApply && c[stageKey]) {
        const stageDate = new Date(c[stageKey]);
        if (!isNaN(stageDate)) {
          const applyDate = new Date(c.dateOfApply);
          const days = Math.abs(stageDate - applyDate) / (1000 * 60 * 60 * 24);
          if (days >= 0 && days < 365) {
            daysToReachStage.push(days);
            positionDetails[position].avgDaysToStage.push(days);
            recruiterDetails[recruiter].avgDaysToStage.push(days);
            platformPositionMatrix[matrixKey].avgDaysToStage.push(days);
          }
        }
      }
      
      if (c.daysToFirstContact !== null && c.daysToFirstContact >= 0) {
        recruiterDetails[recruiter].avgResponseTime.push(c.daysToFirstContact);
      }
      
      if (c.totalTouchpoints > 0) {
        touchpointsToReachStage.push(c.totalTouchpoints);
      }
    });

    const avgExp = expCount > 0 ? (totalExp / expCount).toFixed(2) : 0;
    const avgCalls = candidates.length > 0 ? (totalCalls / candidates.length).toFixed(2) : 0;
    const avgMessages = candidates.length > 0 ? (totalMessages / candidates.length).toFixed(2) : 0;
    const avgTouchpoints = candidates.length > 0 ? (totalTouchpoints / candidates.length).toFixed(2) : 0;
    const avgDaysInPipeline = pipelineCount > 0 ? (totalDaysInPipeline / pipelineCount).toFixed(1) : 0;
    
    const avgDaysToStage = daysToReachStage.length > 0 
      ? (daysToReachStage.reduce((a, b) => a + b, 0) / daysToReachStage.length).toFixed(1) 
      : 'N/A';
    
    const avgTouchpointsToStage = touchpointsToReachStage.length > 0
      ? (touchpointsToReachStage.reduce((a, b) => a + b, 0) / touchpointsToReachStage.length).toFixed(1)
      : 'N/A';

    Object.keys(positionDetails).forEach(pos => {
      const pd = positionDetails[pos];
      pd.avgExp = pd.experiences.length > 0 
        ? (pd.experiences.reduce((a,b) => a+b, 0) / pd.experiences.length).toFixed(2) 
        : 0;
      pd.avgDaysToStage = pd.avgDaysToStage.length > 0
        ? (pd.avgDaysToStage.reduce((a,b) => a+b, 0) / pd.avgDaysToStage.length).toFixed(1)
        : 'N/A';
      pd.avgCalls = (pd.avgCalls / pd.total).toFixed(2);
      pd.avgMessages = (pd.avgMessages / pd.total).toFixed(2);
      pd.topPlatform = Object.entries(pd.platforms).sort((a,b) => b[1] - a[1])[0];
      pd.topRecruiter = Object.entries(pd.recruiters).sort((a,b) => b[1] - a[1])[0];
    });

    Object.keys(recruiterDetails).forEach(rec => {
      const rd = recruiterDetails[rec];
      rd.avgExp = rd.experiences.length > 0 
        ? (rd.experiences.reduce((a,b) => a+b, 0) / rd.experiences.length).toFixed(2) 
        : 0;
      rd.avgDaysToStage = rd.avgDaysToStage.length > 0
        ? (rd.avgDaysToStage.reduce((a,b) => a+b, 0) / rd.avgDaysToStage.length).toFixed(1)
        : 'N/A';
      rd.avgResponseTime = rd.avgResponseTime.length > 0
        ? (rd.avgResponseTime.reduce((a,b) => a+b, 0) / rd.avgResponseTime.length).toFixed(1)
        : 'N/A';
      rd.avgCalls = (rd.totalCalls / rd.total).toFixed(2);
      rd.avgMessages = (rd.totalMessages / rd.total).toFixed(2);
      rd.topPosition = Object.entries(rd.positions).sort((a,b) => b[1] - a[1])[0];
      rd.topPlatform = Object.entries(rd.platforms).sort((a,b) => b[1] - a[1])[0];
    });

    Object.keys(platformPositionMatrix).forEach(key => {
      const ppm = platformPositionMatrix[key];
      ppm.avgExp = ppm.experiences.length > 0
        ? (ppm.experiences.reduce((a,b) => a+b, 0) / ppm.experiences.length).toFixed(2)
        : 0;
      ppm.avgDaysToStage = ppm.avgDaysToStage.length > 0
        ? (ppm.avgDaysToStage.reduce((a,b) => a+b, 0) / ppm.avgDaysToStage.length).toFixed(1)
        : 'N/A';
    });

    const topPlatform = Object.entries(platforms).sort((a, b) => b[1] - a[1])[0];
    const topPosition = Object.entries(positions).sort((a, b) => b[1] - a[1])[0];
    const topRecruiter = Object.entries(recruiters).sort((a, b) => b[1] - a[1])[0];
    const topExperience = Object.entries(experienceBuckets).sort((a, b) => b[1] - a[1])[0];
    const bestMonth = Object.entries(monthlyTrend).sort((a, b) => b[1] - a[1])[0];
    const bestDay = Object.entries(dayOfWeekTrend).sort((a, b) => b[1] - a[1])[0];
    const topLocation = Object.entries(locationDistribution).sort((a, b) => b[1] - a[1])[0];
    const topEducation = Object.entries(educationLevels).sort((a, b) => b[1] - a[1])[0];

    const platformStrategy = [];
    Object.entries(positionDetails).forEach(([position, pd]) => {
      const platformPerf = Object.entries(pd.platforms)
        .map(([platform, count]) => ({
          platform,
          count,
          percentage: ((count / pd.total) * 100).toFixed(1),
          avgExp: platformPositionMatrix[`${platform}|${position}`]?.avgExp || 0,
          avgDays: platformPositionMatrix[`${platform}|${position}`]?.avgDaysToStage || 'N/A'
        }))
        .sort((a, b) => b.count - a.count);
      
      if (platformPerf.length > 0) {
        const bestPlatform = platformPerf[0];
        const secondBest = platformPerf[1];
        
        platformStrategy.push({
          position,
          recommendation: bestPlatform.percentage > 50 
            ? `Strong focus on ${bestPlatform.platform}` 
            : secondBest 
            ? `Balance between ${bestPlatform.platform} and ${secondBest.platform}`
            : `Use ${bestPlatform.platform}`,
          primaryPlatform: bestPlatform.platform,
          primaryShare: bestPlatform.percentage,
          secondaryPlatform: secondBest?.platform || 'None',
          secondaryShare: secondBest?.percentage || 0,
          totalCandidates: pd.total,
          avgExperience: pd.avgExp,
          allPlatforms: platformPerf
        });
      }
    });

    const insights = [];
    if (topPlatform && topPlatform[1] / candidates.length > 0.5) {
      insights.push({
        type: 'info',
        category: 'Source Strategy',
        text: `${topPlatform[0]} is your dominant source at this stage with ${((topPlatform[1] / candidates.length) * 100).toFixed(1)}% of candidates. ${topPosition ? `Most effective for ${topPosition[0]} positions.` : ''}`
      });
    }
    
    const topPositions = Object.entries(positionDetails).sort((a, b) => b[1].total - a[1].total).slice(0, 3);
    topPositions.forEach(([pos, details]) => {
      if (details.topPlatform) {
        insights.push({
          type: 'success',
          category: `${pos} - Best Source`,
          text: `For ${pos} roles, ${details.topPlatform[0]} delivers ${details.topPlatform[1]} candidates (${((details.topPlatform[1] / details.total) * 100).toFixed(1)}%). Average experience: ${details.avgExp} years. Time to stage: ${details.avgDaysToStage} days.`
        });
      }
    });
    
    const topRecruiters = Object.entries(recruiterDetails).sort((a, b) => b[1].total - a[1].total).slice(0, 3);
    topRecruiters.forEach(([rec, details]) => {
      if (details.topPosition) {
        insights.push({
          type: 'info',
          category: `${rec} - Specialization`,
          text: `${rec} excels with ${details.topPosition[0]} roles (${details.topPosition[1]} candidates). Primary source: ${details.topPlatform ? details.topPlatform[0] : 'N/A'}. Avg response: ${details.avgResponseTime} days.`
        });
      }
    });
    
    if (topExperience && topExperience[1] / candidates.length > 0.4) {
      insights.push({
        type: 'warning',
        category: 'Experience Distribution',
        text: `${topExperience[0]} dominates with ${((topExperience[1] / candidates.length) * 100).toFixed(1)}% of candidates at this stage. Consider diversifying experience levels for better team balance.`
      });
    }
    
    if (topLocation && topLocation[0] !== 'Unknown' && topLocation[1] / candidates.length > 0.3) {
      insights.push({
        type: 'info',
        category: 'Geographic Focus',
        text: `${topLocation[0]} is your primary talent hub with ${topLocation[1]} candidates (${((topLocation[1] / candidates.length) * 100).toFixed(1)}%). Consider expanding reach to other locations.`
      });
    }
    
    if (bestDay) {
      insights.push({
        type: 'success',
        category: 'Optimal Timing',
        text: `${bestDay[0]} shows highest activity with ${bestDay[1]} candidates. Schedule key communications and follow-ups on this day for maximum engagement.`
      });
    }
    
    if (avgDaysToStage !== 'N/A') {
      if (parseFloat(avgDaysToStage) > 7) {
        insights.push({
          type: 'warning',
          category: 'Process Speed',
          text: `Average ${avgDaysToStage} days to reach this stage exceeds optimal 7-day target. Fastest position: ${Object.entries(positionDetails).sort((a,b) => parseFloat(a[1].avgDaysToStage) - parseFloat(b[1].avgDaysToStage))[0]?.[0] || 'N/A'}.`
        });
      } else if (parseFloat(avgDaysToStage) <= 3) {
        insights.push({
          type: 'success',
          category: 'Excellent Velocity',
          text: `Outstanding! Candidates reach this stage in just ${avgDaysToStage} days on average. This is industry-leading performance that should be replicated across all stages.`
        });
      }
    }

    const recommendations = [];
    
    platformStrategy.forEach(strategy => {
      if (strategy.primaryShare > 70) {
        recommendations.push({
          priority: 'high',
          category: `${strategy.position} - Sourcing`,
          action: `Diversify Platform Mix for ${strategy.position}`,
          details: `Currently ${strategy.primaryShare}% candidates come from ${strategy.primaryPlatform}. Add 2-3 secondary platforms to reduce dependency risk and increase candidate pool.`,
          expectedImpact: `+30-40% candidate volume, reduced sourcing risk`,
          timeline: '2-3 weeks',
          specificActions: [
            `Test ${strategy.position} postings on LinkedIn, Indeed, and Naukri`,
            `Allocate 60% budget to ${strategy.primaryPlatform}, 40% to new platforms`,
            `Track cost-per-candidate across all platforms`,
            `Set target: reduce ${strategy.primaryPlatform} share to 50-60%`
          ]
        });
      } else if (strategy.primaryShare < 40 && strategy.totalCandidates > 5) {
        recommendations.push({
          priority: 'medium',
          category: `${strategy.position} - Optimization`,
          action: `Consolidate Platform Strategy for ${strategy.position}`,
          details: `Fragmented sourcing with ${strategy.primaryPlatform} at only ${strategy.primaryShare}%. Focus on top 2 platforms: ${strategy.primaryPlatform} and ${strategy.secondaryPlatform}.`,
          expectedImpact: `Better ROI, streamlined process`,
          timeline: '1-2 weeks',
          specificActions: [
            `Increase posting frequency on ${strategy.primaryPlatform}`,
            `Improve job descriptions on top platforms`,
            `Phase out underperforming platforms`,
            `Monitor quality metrics: experience levels and conversion rates`
          ]
        });
      }
      
      const posDetail = positionDetails[strategy.position];
      if (posDetail && parseFloat(posDetail.avgDaysToStage) > 7) {
        recommendations.push({
          priority: 'high',
          category: `${strategy.position} - Speed`,
          action: `Accelerate ${strategy.position} Pipeline`,
          details: `${strategy.position} candidates take ${posDetail.avgDaysToStage} days to reach this stage. Implement faster screening and communication.`,
          expectedImpact: `Reduce time to ${(parseFloat(posDetail.avgDaysToStage) * 0.6).toFixed(1)} days`,
          timeline: '1 week',
          specificActions: [
            `Assign dedicated recruiter for ${strategy.position}`,
            `Automated reminders at 24h, 48h, 72h intervals`,
            `Pre-screen candidates within 4 hours of application`,
            `Use ${strategy.primaryPlatform} quick-apply features`
          ]
        });
      }
    });
    
    const recruiterWorkloads = Object.entries(recruiterDetails).map(([name, details]) => ({
      name,
      load: details.total,
      avgResponse: details.avgResponseTime
    }));
    
    if (recruiterWorkloads.length > 1) {
      const maxLoad = Math.max(...recruiterWorkloads.map(r => r.load));
      const minLoad = Math.min(...recruiterWorkloads.map(r => r.load));
      
      if (maxLoad / minLoad > 2) {
        const overloaded = recruiterWorkloads.find(r => r.load === maxLoad);
        const underloaded = recruiterWorkloads.find(r => r.load === minLoad);
        
        recommendations.push({
          priority: 'high',
          category: 'Resource Balancing',
          action: 'Redistribute Recruiter Workload',
          details: `${overloaded.name} handles ${maxLoad} candidates while ${underloaded.name} has only ${minLoad}. This ${maxLoad - minLoad} candidate gap causes response delays.`,
          expectedImpact: `Balanced workload, faster response times`,
          timeline: 'Immediate',
          specificActions: [
            `Transfer 30% of ${overloaded.name}'s pipeline to ${underloaded.name}`,
            `Implement round-robin assignment for new candidates`,
            `Set maximum load: 50 candidates per recruiter at this stage`,
            `Monitor response time metrics daily`
          ]
        });
      }
    }
    
    const expDiversity = Object.values(experienceBuckets).filter(count => count > 0).length;
    if (expDiversity < 3 && candidates.length > 20) {
      recommendations.push({
        priority: 'medium',
        category: 'Quality Mix',
        action: 'Improve Experience Level Diversity',
        details: `Only ${expDiversity} experience brackets represented at this stage. Aim for mix of freshers, mid-level (2-3y), and experienced (5y+) for knowledge transfer.`,
        expectedImpact: `Better team dynamics, mentorship opportunities`,
        timeline: 'Next recruitment cycle',
        specificActions: [
          `Target: 40% freshers, 40% mid-level (2-4y), 20% experienced (5y+)`,
          `Adjust job descriptions to attract diverse experience levels`,
          `Use experience filters in platform targeting`,
          `Create separate campaigns for each experience bracket`
        ]
      });
    }

    return {
      totalCount: candidates.length,
      demographics: {
        platforms,
        positions,
        recruiters,
        experienceBuckets,
        ageGroups,
        genderDistribution,
        locationDistribution,
        educationLevels,
        monthlyTrend,
        dayOfWeekTrend,
        avgExp,
        topPlatform,
        topPosition,
        topRecruiter,
        topExperience,
        bestMonth,
        bestDay,
        topLocation,
        topEducation
      },
      positionAnalysis: positionDetails,
      recruiterAnalysis: recruiterDetails,
      platformStrategy: platformStrategy,
      platformPositionMatrix: Object.values(platformPositionMatrix),
      performance: {
        avgCalls,
        avgMessages,
        avgTouchpoints,
        avgDaysInPipeline,
        avgDaysToStage,
        avgTouchpointsToStage,
        totalCalls,
        totalMessages,
        totalTouchpoints
      },
      insights,
      recommendations
    };
  };

  const currentAnalysis = selectedStage ? analyzeStage(selectedStage.key) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                <FaChartBar className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-xl font-black text-gray-900 truncate">Stage-wise Analysis</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Comprehensive demographics, position-wise, recruiter-wise analysis with platform strategy</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Total Candidates</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">{filteredData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4">

        {/* Date Wise Filter */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaCalendar className="text-gray-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">Date Wise Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-blue-500 text-sm font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-blue-500 text-sm font-medium"
              />
            </div>
            
            <div>
              <button type="button"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md"
              >
                Clear Filter
              </button>
            </div>
          </div>
          
          {(dateFrom || dateTo) && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-800">
                <FaFilter className="inline mr-2" />
                Showing {filteredData.length} candidates
                {dateFrom && ` from ${new Date(dateFrom).toLocaleDateString()}`}
                {dateFrom && dateTo && ' to '}
                {dateTo && `${new Date(dateTo).toLocaleDateString()}`}
              </p>
            </div>
          )}
        </div>

        {/* Stage Selection */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Select Stage for Detailed Analysis</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {stages.map((stage, idx) => {
              const stageData = analyzeStage(stage.key);
              const isSelected = selectedStage?.id === stage.id;
              
              return (
                <button type="button"
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500">Stage {idx + 1}</span>
                    <span className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                      {stageData.totalCount}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{stage.name}</p>
                  <p className="text-xs text-gray-500">{stage.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Analysis Content */}
        {selectedStage && currentAnalysis && currentAnalysis.totalCount > 0 && (
          <div className="space-y-6">
            {/* Stage Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedStage.name}</h2>
                  <p className="text-blue-100">{selectedStage.description}</p>
                </div>
                <button type="button"
                  onClick={() => setSelectedStage(null)}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                  <FaUsers className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Total</p>
                  <p className="text-3xl font-bold">{currentAnalysis.totalCount}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                  <FaBriefcase className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Positions</p>
                  <p className="text-3xl font-bold">{Object.keys(currentAnalysis.positionAnalysis).length}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                  <FaUserTie className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Recruiters</p>
                  <p className="text-3xl font-bold">{Object.keys(currentAnalysis.recruiterAnalysis).length}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                  <FaMapMarkerAlt className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Platforms</p>
                  <p className="text-3xl font-bold">{Object.keys(currentAnalysis.demographics.platforms).length}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                  <FaGraduationCap className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Avg Exp</p>
                  <p className="text-3xl font-bold">{currentAnalysis.demographics.avgExp}y</p>
                </div>
              </div>
            </div>

            {/* Platform Strategy Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button type="button"
                onClick={() => toggleSection('platformStrategy')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaFire className="text-2xl text-red-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Platform Strategy - Best Platforms by Position</h3>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                    {currentAnalysis.platformStrategy.length} positions analyzed
                  </span>
                </div>
                {expandedSections.platformStrategy ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.platformStrategy && (
                <div className="p-6 border-t border-gray-200 space-y-4">
                  {currentAnalysis.platformStrategy.map((strategy, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-5 border-2 border-orange-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FaBriefcase className="text-2xl text-orange-600" />
                            <h4 className="text-xl font-bold text-gray-900">{strategy.position}</h4>
                            <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                              {strategy.totalCandidates} candidates
                            </span>
                          </div>
                          <p className="text-lg font-semibold text-orange-900 mb-3">
                            <FaLightbulb className="inline mr-2" />
                            {strategy.recommendation}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">PRIMARY PLATFORM</span>
                            <FaStar className="text-yellow-500" />
                          </div>
                          <p className="text-2xl font-bold text-green-700 mb-1">{strategy.primaryPlatform}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-green-600 h-3 rounded-full"
                                style={{ width: `${strategy.primaryShare}%` }}
                              />
                            </div>
                            <span className="text-lg font-bold text-green-700">{strategy.primaryShare}%</span>
                          </div>
                        </div>

                        {strategy.secondaryPlatform !== 'None' && (
                          <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">SECONDARY PLATFORM</span>
                              <FaThumbsUp className="text-blue-500" />
                            </div>
                            <p className="text-2xl font-bold text-blue-700 mb-1">{strategy.secondaryPlatform}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-blue-600 h-3 rounded-full"
                                  style={{ width: `${strategy.secondaryShare}%` }}
                                />
                              </div>
                              <span className="text-lg font-bold text-blue-700">{strategy.secondaryShare}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FaChartBar className="text-purple-600" />
                          All Platform Performance for {strategy.position}
                        </h5>
                        <div className="space-y-2">
                          {strategy.allPlatforms.map((plat, pidx) => (
                            <div key={pidx} className="flex items-center gap-3">
                              <div className="w-32 text-sm font-medium text-gray-700">{plat.platform}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${plat.percentage}%` }}
                                />
                              </div>
                              <div className="w-16 text-right">
                                <span className="text-sm font-bold text-purple-700">{plat.count}</span>
                                <span className="text-xs text-gray-500 ml-1">({plat.percentage}%)</span>
                              </div>
                              <div className="w-24 text-xs text-gray-600">
                                Avg: {plat.avgExp}y exp
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Position-wise Analysis Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button type="button"
                onClick={() => toggleSection('positionAnalysis')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaBriefcase className="text-2xl text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Position-wise Detailed Analysis</h3>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-semibold">
                    {Object.keys(currentAnalysis.positionAnalysis).length} positions
                  </span>
                </div>
                {expandedSections.positionAnalysis ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.positionAnalysis && (
                <div className="p-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(currentAnalysis.positionAnalysis)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([position, details]) => (
                        <div key={position} className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <FaBriefcase className="text-purple-600" />
                              {position}
                            </h4>
                            <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                              {details.total} candidates
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                            <div className="bg-white rounded p-3 text-center">
                              <FaGraduationCap className="text-green-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Avg Experience</p>
                              <p className="text-xl font-bold text-green-700">{details.avgExp}y</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaClock className="text-blue-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Avg Days</p>
                              <p className="text-xl font-bold text-blue-700">{details.avgDaysToStage}</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaPhone className="text-indigo-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Avg Calls</p>
                              <p className="text-xl font-bold text-indigo-700">{details.avgCalls}</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaEnvelope className="text-amber-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Avg Messages</p>
                              <p className="text-xl font-bold text-amber-700">{details.avgMessages}</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaStar className="text-yellow-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Top Platform</p>
                              <p className="text-sm font-bold text-yellow-700">{details.topPlatform?.[0] || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded p-3">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-blue-600" />
                                Platform Distribution
                              </h5>
                              <div className="space-y-1">
                                {Object.entries(details.platforms)
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([plat, count]) => (
                                    <div key={plat} className="flex justify-between text-xs">
                                      <span className="text-gray-700">{plat}</span>
                                      <span className="font-bold text-blue-600">{count} ({((count/details.total)*100).toFixed(0)}%)</span>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div className="bg-white rounded p-3">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FaUserTie className="text-green-600" />
                                Recruiter Distribution
                              </h5>
                              <div className="space-y-1">
                                {Object.entries(details.recruiters)
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([rec, count]) => (
                                    <div key={rec} className="flex justify-between text-xs">
                                      <span className="text-gray-700">{rec}</span>
                                      <span className="font-bold text-green-600">{count} ({((count/details.total)*100).toFixed(0)}%)</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recruiter-wise Analysis Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button type="button"
                onClick={() => toggleSection('recruiterAnalysis')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaUserTie className="text-2xl text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Recruiter-wise Performance Analysis</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    {Object.keys(currentAnalysis.recruiterAnalysis).length} recruiters
                  </span>
                </div>
                {expandedSections.recruiterAnalysis ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.recruiterAnalysis && (
                <div className="p-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(currentAnalysis.recruiterAnalysis)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([recruiter, details]) => (
                        <div key={recruiter} className="bg-green-50 rounded-lg p-5 border border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <FaUserTie className="text-green-600" />
                              {recruiter}
                            </h4>
                            <span className="bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                              {details.total} candidates
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                            <div className="bg-white rounded p-3 text-center">
                              <FaGraduationCap className="text-purple-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Avg Exp</p>
                              <p className="text-lg font-bold text-purple-700">{details.avgExp}y</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaClock className="text-blue-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Response</p>
                              <p className="text-lg font-bold text-blue-700">{details.avgResponseTime}d</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaPhone className="text-indigo-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Total Calls</p>
                              <p className="text-lg font-bold text-indigo-700">{details.totalCalls}</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaEnvelope className="text-amber-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Messages</p>
                              <p className="text-lg font-bold text-amber-700">{details.totalMessages}</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaBriefcase className="text-red-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Top Position</p>
                              <p className="text-xs font-bold text-red-700">{details.topPosition?.[0] || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded p-3 text-center">
                              <FaMapMarkerAlt className="text-teal-600 mx-auto mb-1" />
                              <p className="text-xs text-gray-600">Top Source</p>
                              <p className="text-xs font-bold text-teal-700">{details.topPlatform?.[0] || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded p-3">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FaBriefcase className="text-purple-600" />
                                Position Specialization
                              </h5>
                              <div className="space-y-1">
                                {Object.entries(details.positions)
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([pos, count]) => (
                                    <div key={pos} className="flex justify-between text-xs">
                                      <span className="text-gray-700 truncate">{pos}</span>
                                      <span className="font-bold text-purple-600 ml-2">{count} ({((count/details.total)*100).toFixed(0)}%)</span>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div className="bg-white rounded p-3">
                              <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-teal-600" />
                                Platform Usage
                              </h5>
                              <div className="space-y-1">
                                {Object.entries(details.platforms)
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([plat, count]) => (
                                    <div key={plat} className="flex justify-between text-xs">
                                      <span className="text-gray-700">{plat}</span>
                                      <span className="font-bold text-teal-600">{count} ({((count/details.total)*100).toFixed(0)}%)</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Demographics Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button type="button"
                onClick={() => toggleSection('demographics')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaUsers className="text-2xl text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Demographics & Characteristics</h3>
                </div>
                {expandedSections.demographics ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.demographics && (
                <div className="p-6 border-t border-gray-200 space-y-6">
                  {/* Experience Distribution */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaGraduationCap className="text-green-600" />
                      Experience Level Distribution
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {Object.entries(currentAnalysis.demographics.experienceBuckets).map(([level, count]) => (
                        <div key={level} className="bg-white rounded p-4 text-center">
                          <p className="text-sm text-gray-600 mb-2">{level}</p>
                          <p className="text-3xl font-bold text-green-600 mb-2">{count}</p>
                          <p className="text-xs text-gray-500">{((count / currentAnalysis.totalCount) * 100).toFixed(1)}%</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(count / currentAnalysis.totalCount) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Distribution */}
                  {Object.keys(currentAnalysis.demographics.locationDistribution).length > 1 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        Geographic Distribution
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Object.entries(currentAnalysis.demographics.locationDistribution)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 8)
                          .map(([loc, count]) => (
                            <div key={loc} className="bg-white rounded p-3">
                              <p className="text-sm font-medium text-gray-700 truncate">{loc}</p>
                              <p className="text-2xl font-bold text-blue-600">{count}</p>
                              <p className="text-xs text-gray-500">{((count / currentAnalysis.totalCount) * 100).toFixed(1)}%</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Education Levels */}
                  {Object.keys(currentAnalysis.demographics.educationLevels).length > 1 && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaGraduationCap className="text-purple-600" />
                        Education Levels
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(currentAnalysis.demographics.educationLevels)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 6)
                          .map(([edu, count]) => (
                            <div key={edu} className="bg-white rounded p-3 flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{edu}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(count/currentAnalysis.totalCount)*100}%` }} />
                                </div>
                                <span className="text-lg font-bold text-purple-600 w-16 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Day of Week Pattern */}
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FaCalendar className="text-teal-600" />
                      Day of Week Activity Pattern
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(currentAnalysis.demographics.dayOfWeekTrend)
                        .sort((a, b) => b[1] - a[1])
                        .map(([day, count]) => (
                          <div key={day} className="bg-white rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700 w-24">{day}</span>
                              <div className="flex-1 mx-3">
                                <div className="bg-gray-200 rounded-full h-3">
                                  <div className="bg-teal-600 h-3 rounded-full" style={{ width: `${(count/currentAnalysis.totalCount)*100}%` }} />
                                </div>
                              </div>
                              <span className="text-lg font-bold text-teal-600 w-16 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                    {currentAnalysis.demographics.bestDay && (
                      <div className="mt-3 p-3 bg-teal-100 rounded text-center">
                        <FaTrophy className="inline text-teal-600 mr-2 text-xl" />
                        <span className="text-sm font-bold text-teal-900">
                          Peak Activity Day: {currentAnalysis.demographics.bestDay[0]} with {currentAnalysis.demographics.bestDay[1]} candidates
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Performance Metrics Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button type="button"
                onClick={() => toggleSection('performance')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaChartLine className="text-2xl text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Performance Metrics</h3>
                </div>
                {expandedSections.performance ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.performance && (
                <div className="p-6 border-t border-gray-200 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                      <FaPhone className="text-2xl mb-2 opacity-80" />
                      <p className="text-sm opacity-90 mb-1">Total Calls Made</p>
                      <p className="text-3xl font-bold">{currentAnalysis.performance.totalCalls}</p>
                      <p className="text-xs opacity-75 mt-2">Avg: {currentAnalysis.performance.avgCalls} per candidate</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                      <FaEnvelope className="text-2xl mb-2 opacity-80" />
                      <p className="text-sm opacity-90 mb-1">Total Messages Sent</p>
                      <p className="text-3xl font-bold">{currentAnalysis.performance.totalMessages}</p>
                      <p className="text-xs opacity-75 mt-2">Avg: {currentAnalysis.performance.avgMessages} per candidate</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                      <FaHashtag className="text-2xl mb-2 opacity-80" />
                      <p className="text-sm opacity-90 mb-1">Total Touchpoints</p>
                      <p className="text-3xl font-bold">{currentAnalysis.performance.totalTouchpoints}</p>
                      <p className="text-xs opacity-75 mt-2">Avg: {currentAnalysis.performance.avgTouchpoints} per candidate</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
                      <FaClock className="text-2xl mb-2 opacity-80" />
                      <p className="text-sm opacity-90 mb-1">Avg Days to Stage</p>
                      <p className="text-3xl font-bold">{currentAnalysis.performance.avgDaysToStage}</p>
                      <p className="text-xs opacity-75 mt-2">From application</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Insights Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button type="button"
                onClick={() => toggleSection('insights')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaInfoCircle className="text-2xl text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Key Insights</h3>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-semibold">
                    {currentAnalysis.insights.length} insights
                  </span>
                </div>
                {expandedSections.insights ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.insights && (
                <div className="p-6 border-t border-gray-200">
                  {currentAnalysis.insights.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaInfoCircle className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No specific insights available for this stage yet.</p>
                      <p className="text-sm mt-2">Continue collecting data for better analysis.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentAnalysis.insights.map((insight, idx) => (
                        <div 
                          key={idx}
                          className={`rounded-lg p-4 border-l-4 ${
                            insight.type === 'success' 
                              ? 'bg-green-50 border-green-500' 
                              : insight.type === 'warning'
                              ? 'bg-amber-50 border-amber-500'
                              : 'bg-blue-50 border-blue-500'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {insight.type === 'success' && <FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-1" />}
                            {insight.type === 'warning' && <FaExclamationTriangle className="text-amber-600 text-xl flex-shrink-0 mt-1" />}
                            {insight.type === 'info' && <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-1" />}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                  insight.type === 'success' 
                                    ? 'bg-green-200 text-green-800' 
                                    : insight.type === 'warning'
                                    ? 'bg-amber-200 text-amber-800'
                                    : 'bg-blue-200 text-blue-800'
                                }`}>
                                  {insight.category}
                                </span>
                              </div>
                              <p className={`text-sm font-medium ${
                                insight.type === 'success' 
                                  ? 'text-green-900' 
                                  : insight.type === 'warning'
                                  ? 'text-amber-900'
                                  : 'text-blue-900'
                              }`}>
                                {insight.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recommendations Section */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <button type="button"
                onClick={() => toggleSection('recommendations')}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaLightbulb className="text-2xl text-amber-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Action Recommendations</h3>
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-semibold">
                    {currentAnalysis.recommendations.length} actions
                  </span>
                </div>
                {expandedSections.recommendations ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.recommendations && (
                <div className="p-6 border-t border-gray-200">
                  {currentAnalysis.recommendations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaCheckCircle className="text-4xl mx-auto mb-3 text-green-500" />
                      <p className="font-semibold text-gray-700">Stage is performing optimally!</p>
                      <p className="text-sm mt-2">No critical recommendations at this time.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentAnalysis.recommendations.map((rec, idx) => (
                        <div 
                          key={idx}
                          className={`rounded-lg p-5 border-2 ${
                            rec.priority === 'high' 
                              ? 'bg-red-50 border-red-300' 
                              : rec.priority === 'medium'
                              ? 'bg-amber-50 border-amber-300'
                              : 'bg-blue-50 border-blue-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                              rec.priority === 'high' 
                                ? 'bg-red-200' 
                                : rec.priority === 'medium'
                                ? 'bg-amber-200'
                                : 'bg-blue-200'
                            }`}>
                              {rec.priority === 'high' && <FaExclamationTriangle className="text-red-700 text-xl" />}
                              {rec.priority === 'medium' && <FaInfoCircle className="text-amber-700 text-xl" />}
                              {rec.priority === 'low' && <FaLightbulb className="text-blue-700 text-xl" />}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                  rec.priority === 'high' 
                                    ? 'bg-red-200 text-red-800' 
                                    : rec.priority === 'medium'
                                    ? 'bg-amber-200 text-amber-800'
                                    : 'bg-blue-200 text-blue-800'
                                }`}>
                                  {rec.priority} Priority
                                </span>
                                <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                                  {rec.category}
                                </span>
                              </div>
                              
                              <h4 className={`text-lg font-bold mb-2 ${
                                rec.priority === 'high' 
                                  ? 'text-red-900' 
                                  : rec.priority === 'medium'
                                  ? 'text-amber-900'
                                  : 'text-blue-900'
                              }`}>
                                {rec.action}
                              </h4>
                              
                              <p className={`text-sm mb-3 ${
                                rec.priority === 'high' 
                                  ? 'text-red-800' 
                                  : rec.priority === 'medium'
                                  ? 'text-amber-800'
                                  : 'text-blue-800'
                              }`}>
                                {rec.details}
                              </p>
                              
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-white rounded p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FaArrowUp className="text-green-600 text-sm" />
                                    <span className="text-xs text-gray-600 font-semibold">Expected Impact</span>
                                  </div>
                                  <p className="text-sm font-bold text-green-700">{rec.expectedImpact}</p>
                                </div>
                                
                                <div className="bg-white rounded p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FaClock className="text-blue-600 text-sm" />
                                    <span className="text-xs text-gray-600 font-semibold">Timeline</span>
                                  </div>
                                  <p className="text-sm font-bold text-blue-700">{rec.timeline}</p>
                                </div>
                              </div>

                              {rec.specificActions && rec.specificActions.length > 0 && (
                                <div className="bg-white rounded p-3 mt-3">
                                  <h5 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                                    <FaClipboardList className="text-gray-600" />
                                    Specific Action Steps:
                                  </h5>
                                  <ul className="space-y-1">
                                    {rec.specificActions.map((action, aidx) => (
                                      <li key={aidx} className="text-xs text-gray-700 flex items-start gap-2">
                                        <span className="text-blue-600 font-bold">{aidx + 1}.</span>
                                        <span>{action}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Stage Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
                  <FaUsers className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Total Candidates</p>
                  <p className="text-2xl font-bold">{currentAnalysis.totalCount}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
                  <FaBriefcase className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Positions</p>
                  <p className="text-2xl font-bold">{Object.keys(currentAnalysis.positionAnalysis).length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
                  <FaUserTie className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Recruiters</p>
                  <p className="text-2xl font-bold">{Object.keys(currentAnalysis.recruiterAnalysis).length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
                  <FaLightbulb className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Insights</p>
                  <p className="text-2xl font-bold">{currentAnalysis.insights.length}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur">
                  <FaTrophy className="text-2xl mb-2" />
                  <p className="text-sm opacity-90">Recommendations</p>
                  <p className="text-2xl font-bold">{currentAnalysis.recommendations.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions when no stage selected */}
        {!selectedStage && (
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 md:p-12 text-center">
            <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Stage to Begin Deep Analysis</h3>
            <p className="text-gray-600 mb-6">Choose any stage above to view comprehensive demographics, position-wise analysis, recruiter performance, platform strategy, and actionable recommendations.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-red-50 rounded-lg p-4">
                <FaFire className="text-2xl text-red-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Platform Strategy</h4>
                <p className="text-sm text-gray-600">Intelligent recommendations on which platforms work best for which positions for maximum ROI.</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <FaBriefcase className="text-2xl text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Position Analysis</h4>
                <p className="text-sm text-gray-600">Detailed breakdown by position including best platforms, avg experience, speed, and recruiter assignments.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <FaUserTie className="text-2xl text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Recruiter Performance</h4>
                <p className="text-sm text-gray-600">Individual recruiter metrics including specialization, workload, response time, and success rates.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <FaUsers className="text-2xl text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Demographics</h4>
                <p className="text-sm text-gray-600">Complete candidate characteristics: experience, location, education, timing patterns, and more.</p>
              </div>
            </div>
          </div>
        )}

        {/* No data state */}
        {selectedStage && currentAnalysis && currentAnalysis.totalCount === 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 md:p-12 text-center">
            <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Data Available for This Stage</h3>
            <p className="text-gray-600 mb-4">There are currently no candidates at the <strong>{selectedStage.name}</strong> stage.</p>
            <button type="button"
              onClick={() => setSelectedStage(null)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Select Another Stage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageWiseAnalysis;