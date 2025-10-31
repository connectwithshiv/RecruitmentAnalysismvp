// import React, { useState, useMemo } from 'react';
// import { TrendingDown, Users, Filter, Calendar, Lightbulb, X, ChevronRight, AlertTriangle, CheckCircle, TrendingUp as TrendingUpIcon, Target, Zap,  Clipboard, 
//   Database, 
//   Send, 
//   Phone, 
//   FileEdit, 
//   FileCheck, 
//   ListTodo, 
//   Mic, 
//   ClipboardCheck, 
//   CheckCheck, 
//   Search, 
//   CheckSquare, 
//   PartyPopper, 
//   Rocket  } from 'lucide-react';

// const RecruitmentFunnel = ({ data }) => {
//   const [selectedFilters, setSelectedFilters] = useState({
//     platform: 'all',
//     assignTo: 'all',
//     currentStage: 'all',
//     experience: 'all',
//     position: 'all',
//     dateFrom: '',
//     dateTo: ''
//   });
//   const [hoveredStage, setHoveredStage] = useState(null);
//   const [selectedStageForSuggestions, setSelectedStageForSuggestions] = useState(null);

//   // Define funnel stages
//   const funnelStages = [
//   { name: 'Job Posting', key: 'total', description: 'Total candidates', icon: Clipboard },
//   { name: 'Data Extraction', key: 'dateOfApply', description: 'Date of Apply filled', icon: Database },
//   { name: 'Bulk Message Sending', key: 'messageSent', description: 'Message Sent', icon: Send },
//   { name: 'First Call', key: 'firstConnectedCall', description: 'First Connected Call', icon: Phone },
//   { name: 'Jotform Submission', key: 'jotFormFilled', description: 'Jot form filled', icon: FileEdit },
//   { name: 'Sign Doc Received', key: 'signDocReceived', description: 'Sign Doc Received', icon: FileCheck },
//   { name: 'Task Assigned', key: 'taskAssigned', description: 'Task Assigned', icon: ListTodo },
//   { name: 'Voice Note Submitted', key: 'voiceNoteSubmitted1', description: 'Voice Note Submitted', icon: Mic },
//   { name: 'Voice Note Approved', key: 'voiceNoteApproved', description: 'Voice Note Approved', icon: CheckCircle },
//   { name: 'Eligibility Task Sub', key: 'eligibilityTaskSubmitted1', description: 'Task Submitted', icon: ClipboardCheck },
//   { name: 'Eligibility Approved', key: 'eligibilityTaskApproved', description: 'Task Approved', icon: CheckCheck },
//   { name: 'Interview Scheduled', key: 'interviewDoneAtOffice', description: 'Interview Done', icon: Target },
//   { name: 'Trial Scheduled', key: 'trialScheduled', description: 'Trial Scheduled', icon: Search },
//   { name: 'Trial Done', key: 'trialDone', description: 'Trial Done', icon: CheckSquare },
//   { name: 'Joined', key: 'joined', description: 'Joined', icon: PartyPopper },
//   { name: 'Worked 90 Days', key: 'workedFor90Days', description: 'Worked 90 Days', icon: Rocket }
// ];

//   // Apply filters
//   const filteredData = useMemo(() => {
//     return data.filter(item => {
//       if (selectedFilters.platform !== 'all' && item.platform !== selectedFilters.platform) return false;
//       if (selectedFilters.assignTo !== 'all' && item.assignTo !== selectedFilters.assignTo) return false;
//       if (selectedFilters.currentStage !== 'all' && item.currentStage !== selectedFilters.currentStage) return false;
//       if (selectedFilters.position !== 'all' && item.position !== selectedFilters.position) return false;
      
//       if (selectedFilters.experience !== 'all') {
//         const exp = item.exp || 0;
//         if (selectedFilters.experience === 'Fresher' && exp > 0) return false;
//         if (selectedFilters.experience === '1-3 years' && (exp < 1 || exp > 3)) return false;
//         if (selectedFilters.experience === '3-5 years' && (exp < 3 || exp > 5)) return false;
//         if (selectedFilters.experience === '5+ years' && exp < 5) return false;
//       }

//       if (selectedFilters.dateFrom && item.dateApplyDate) {
//         const filterDateFrom = new Date(selectedFilters.dateFrom);
//         filterDateFrom.setHours(0, 0, 0, 0);
//         const itemDate = new Date(item.dateApplyDate);
//         itemDate.setHours(0, 0, 0, 0);
//         if (itemDate < filterDateFrom) return false;
//       }
      
//       if (selectedFilters.dateTo && item.dateApplyDate) {
//         const filterDateTo = new Date(selectedFilters.dateTo);
//         filterDateTo.setHours(23, 59, 59, 999);
//         const itemDate = new Date(item.dateApplyDate);
//         itemDate.setHours(0, 0, 0, 0);
//         if (itemDate > filterDateTo) return false;
//       }
      
//       return true;
//     });
//   }, [data, selectedFilters]);

//   const filterOptions = useMemo(() => ({
//     platforms: ['all', ...new Set(data.map(d => d.platform).filter(Boolean))],
//     assignees: ['all', ...new Set(data.map(d => d.assignTo).filter(Boolean))],
//     stages: ['all', ...new Set(data.map(d => d.currentStage).filter(Boolean))],
//     experiences: ['all', 'Fresher', '1-3 years', '3-5 years', '5+ years'],
//     positions: ['all', ...new Set(data.map(d => d.position).filter(Boolean))]
//   }), [data]);

//   // Calculate stage counts with platform and recruiter breakdown
//   const initialCounts = funnelStages.map((stage) => {
//     let count = 0;
//     const platformBreakdown = {};
//     const recruiterBreakdown = {};
//     const candidatesList = [];
    
//     filteredData.forEach(d => {
//       let isInStage = false;
      
//       if (stage.key === 'total') {
//         isInStage = true;
//       } else if (stage.key === 'dateOfApply') {
//         isInStage = d.dateOfApply && d.dateOfApply !== '' && d.dateOfApply !== '-';
//       } else {
//         isInStage = d[stage.key] && d[stage.key] !== '' && d[stage.key] !== '-';
//       }
      
//       if (isInStage) {
//         count++;
//         candidatesList.push(d);
        
//         const platform = d.platform || 'Unknown';
//         const recruiter = d.assignTo || 'Unassigned';
        
//         platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
//         recruiterBreakdown[recruiter] = (recruiterBreakdown[recruiter] || 0) + 1;
//       }
//     });
    
//     return {
//       ...stage,
//       count,
//       platformBreakdown,
//       recruiterBreakdown,
//       candidatesList
//     };
//   });

//   // Second pass: Calculate dropoff and conversion rates
//   const stageCounts = initialCounts.map((stage, idx) => {
//     const prevCount = idx > 0 ? initialCounts[idx - 1].count : filteredData.length;
//     const dropoff = prevCount - stage.count;
//     const dropoffPercent = prevCount > 0 ? ((dropoff / prevCount) * 100).toFixed(1) : '0.0';
//     const conversionRate = filteredData.length > 0 ? ((stage.count / filteredData.length) * 100).toFixed(1) : '0.0';
    
//     return {
//       ...stage,
//       dropoff,
//       dropoffPercent,
//       conversionRate
//     };
//   });

//   // Find biggest bottleneck
//   const bottleneck = stageCounts.reduce((max, stage) => 
//     parseFloat(stage.dropoffPercent) > parseFloat(max.dropoffPercent) ? stage : max
//   , stageCounts[0] || { dropoffPercent: '0.0', name: 'None', dropoff: 0 });

//   const joinedStage = stageCounts.find(s => s.key === 'joined') || { count: 0, conversionRate: '0.0' };

//   // Generate dynamic suggestions based on stage performance and metrics
//   const getSuggestions = (stage, idx) => {
//     const suggestions = [];
//     const dropoff = parseFloat(stage.dropoffPercent);
//     const convRate = parseFloat(stage.conversionRate);
//     const prevCount = idx > 0 ? stageCounts[idx - 1].count : filteredData.length;
    
//     // Check if stage has data
//     if (stage.count === 0 && idx > 0) {
//       suggestions.push({
//         type: 'critical',
//         icon: AlertTriangle,
//         title: 'No Data Available for Analysis',
//         action: `This stage shows 0 candidates. Data may be missing or this stage is not being tracked properly.`,
//         steps: [
//           'Verify if this stage is active in your recruitment process',
//           'Check data entry fields for this stage in your system',
//           'Ensure mandatory field validation is enabled',
//           'Review if candidates are being properly transitioned to this stage',
//           'Consider removing this stage from funnel if not applicable'
//         ]
//       });
//       return suggestions;
//     }

//     // Platform performance analysis
//     const platformEntries = Object.entries(stage.platformBreakdown).sort((a, b) => b[1] - a[1]);
//     const topPlatform = platformEntries[0];
//     const totalPlatformCandidates = stage.count;
    
//     if (platformEntries.length > 1 && topPlatform) {
//       const topPlatformConvRate = ((topPlatform[1] / totalPlatformCandidates) * 100).toFixed(2);
//       const topPlatformName = topPlatform[0];
//       const topPlatformCount = topPlatform[1];
      
//       suggestions.push({
//         type: 'info',
//         icon: Target,
//         title: 'Platform Performance Insights',
//         action: `${topPlatformName} is leading with ${topPlatformCount} candidates (${topPlatformConvRate}% of this stage). ${platformEntries.length > 1 ? `Other platforms: ${platformEntries.slice(1, 3).map(p => `${p[0]} (${p[1]})`).join(', ')}.` : ''}`,
//         steps: [
//           `Prioritize ${topPlatformName} for future recruitment drives`,
//           `Analyze why ${topPlatformName} performs better than others`,
//           `Increase listing frequency on ${topPlatformName}`,
//           platformEntries.length > 2 ? `Evaluate ROI of underperforming platforms: ${platformEntries.slice(-2).map(p => p[0]).join(', ')}` : 'Monitor platform diversity',
//           `Set platform-specific conversion targets based on ${topPlatformName}'s performance`
//         ]
//       });
//     }

//     // Recruiter performance analysis
//     const recruiterEntries = Object.entries(stage.recruiterBreakdown).sort((a, b) => b[1] - a[1]);
//     const topRecruiter = recruiterEntries[0];
    
//     if (recruiterEntries.length > 1 && topRecruiter) {
//       const topRecruiterConvRate = ((topRecruiter[1] / stage.count) * 100).toFixed(2);
//       const recruiterWorkload = Object.values(stage.recruiterBreakdown);
//       const avgWorkload = recruiterWorkload.reduce((a, b) => a + b, 0) / recruiterWorkload.length;
//       const workloadVariance = Math.max(...recruiterWorkload) - Math.min(...recruiterWorkload);
      
//       suggestions.push({
//         type: recruiterEntries.length === 1 ? 'warning' : 'info',
//         icon: Users,
//         title: recruiterEntries.length === 1 ? 'Single Recruiter Handling All Load' : 'Recruiter Performance Distribution',
//         action: recruiterEntries.length === 1 
//           ? `${topRecruiter[0]} is handling all ${topRecruiter[1]} candidates alone. Consider load balancing to improve response time and reduce burnout risk.`
//           : `${topRecruiter[0]} leads with ${topRecruiter[1]} candidates (${topRecruiterConvRate}%). Workload variance is ${workloadVariance} candidates across ${recruiterEntries.length} recruiters.`,
//         steps: recruiterEntries.length === 1 ? [
//           'Introduce task automation to reduce manual workload',
//           'Add additional recruiter support during peak periods',
//           'Implement automated reminders and follow-up systems',
//           'Monitor response time metrics closely',
//           'Set up alerts for bottlenecks in candidate pipeline'
//         ] : [
//           `Learn best practices from ${topRecruiter[0]}'s approach`,
//           workloadVariance > avgWorkload ? 'Rebalance candidate distribution for fair workload' : 'Maintain current workload distribution',
//           'Conduct knowledge sharing sessions among recruiters',
//           'Set individual performance targets based on capacity',
//           'Implement peer mentoring for underperforming recruiters'
//         ]
//       });
//     }
    
//     // Critical dropoff analysis with specific metrics
//     if (dropoff > 30) {
//       const candidatesLost = prevCount - stage.count;
//       const targetRetention = Math.ceil(candidatesLost * 0.3);
      
//       suggestions.push({
//         type: 'critical',
//         icon: AlertTriangle,
//         title: 'Critical Leakage Point Identified',
//         action: `There is a ${dropoff.toFixed(2)}% drop from previous stage, losing ${candidatesLost} candidates. This is a major bottleneck requiring immediate attention.`,
//         steps: [
//           `Target: Retain at least ${targetRetention} more candidates (30% improvement) at this stage`,
//           `Implement automated reminders 24 hours after previous stage completion`,
//           `Reduce time gap between stages - aim for same-day transitions`,
//           `Conduct exit surveys to understand dropout reasons`,
//           `Simplify requirements and provide clear step-by-step guidance`
//         ]
//       });
//     } else if (dropoff > 20) {
//       const candidatesLost = prevCount - stage.count;
      
//       suggestions.push({
//         type: 'warning',
//         icon: TrendingDown,
//         title: 'Moderate Dropoff Detected',
//         action: `${dropoff.toFixed(2)}% dropoff losing ${candidatesLost} candidates. This needs optimization to improve conversion efficiency.`,
//         steps: [
//           `Set target to reduce dropoff below 15% in next cycle`,
//           `Implement follow-up calls within 48 hours`,
//           `Send interest confirmation messages and reminders`,
//           `Analyze top 3 reasons for dropout at this stage`,
//           `Create FAQ document to address common concerns`
//         ]
//       });
//     }
    
//     // Conversion rate analysis with targets
//     if (convRate >= 20 && convRate < 25) {
//       const gap = (25 - convRate).toFixed(2);
//       const candidatesNeeded = Math.ceil((filteredData.length * 0.25) - stage.count);
      
//       suggestions.push({
//         type: 'info',
//         icon: TrendingUpIcon,
//         title: 'Near Target Performance',
//         action: `Achieving ${convRate}% conversion, close to the 25% target with only ${gap}% gap. Good progress with scope for improvement.`,
//         steps: [
//           `Need ${candidatesNeeded} more successful candidates to hit 25% target`,
//           `Implement faster follow-ups - reduce response time by 1 day`,
//           `Increase communication frequency at earlier stages`,
//           `Focus on high-intent candidates identified in initial screening`,
//           `Expected to achieve target within next recruitment cycle with these changes`
//         ]
//       });
//     } else if (convRate >= 15 && convRate < 20) {
//       suggestions.push({
//         type: 'warning',
//         icon: Target,
//         title: 'Below Target Conversion',
//         action: `Current ${convRate}% conversion is ${(20 - convRate).toFixed(2)}% below minimum 20% target. Immediate process improvements needed.`,
//         steps: [
//           `Review entire funnel for bottlenecks causing low conversion`,
//           `Improve candidate quality at sourcing stage`,
//           `Implement multi-channel communication (SMS, Email, Call)`,
//           `Set up daily performance monitoring and alerts`,
//           `Consider revising eligibility criteria if too restrictive`
//         ]
//       });
//     } else if (convRate >= 25) {
//       suggestions.push({
//         type: 'success',
//         icon: CheckCircle,
//         title: 'Exceeding Target Performance',
//         action: `Excellent ${convRate}% conversion rate, exceeding the 25% target by ${(convRate - 25).toFixed(2)}%. Strong performance to maintain and replicate.`,
//         steps: [
//           `Document current processes as best practices`,
//           `Share successful strategies with entire recruitment team`,
//           `Maintain quality while exploring capacity to scale up`,
//           `Set new stretch target of ${(convRate * 1.1).toFixed(1)}% for next cycle`,
//           `Monitor consistency - ensure performance doesn't decline`
//         ]
//       });
//     }
    
//     // Stage-specific metric-driven suggestions
//     if (stage.key === 'messageSent') {
//       const messageDeliveryRate = stage.count > 0 ? ((stage.count / prevCount) * 100).toFixed(2) : 0;
      
//       suggestions.push({
//         type: messageDeliveryRate > 90 ? 'success' : 'warning',
//         icon: messageDeliveryRate > 90 ? CheckCircle : AlertTriangle,
//         title: messageDeliveryRate > 90 ? 'High Message Delivery Rate' : 'Message Delivery Issues',
//         action: messageDeliveryRate > 90 
//           ? `Achieving ${messageDeliveryRate}% message delivery rate, which is excellent. This shows the messaging system is effective and reliable.`
//           : `Only ${messageDeliveryRate}% messages delivered successfully. This needs immediate attention to improve reach.`,
//         steps: messageDeliveryRate > 90 ? [
//           'Maintain current messaging infrastructure',
//           'Use same method for follow-up and reminder campaigns',
//           'A/B test message content for better engagement',
//           'Track message open rates and response times',
//           'Scale up messaging volume with confidence'
//         ] : [
//           'Verify contact numbers and update invalid entries',
//           'Switch to more reliable messaging service provider',
//           'Implement phone number validation at data entry',
//           'Send test messages before bulk campaigns',
//           'Set up delivery failure alerts and retry mechanism'
//         ]
//       });
//     }
    
//     if (stage.key === 'firstConnectedCall') {
//       const callConnectionRate = ((stage.count / prevCount) * 100).toFixed(2);
      
//       suggestions.push({
//         type: callConnectionRate > 50 ? 'success' : 'critical',
//         icon: callConnectionRate > 50 ? CheckCircle : AlertTriangle,
//         title: `Call Connection Rate: ${callConnectionRate}%`,
//         action: callConnectionRate > 50 
//           ? `Call success rate of ${callConnectionRate}% is above 50%, showing good connection rates. Follow-up strategy can further improve this.`
//           : `Call success rate is only ${callConnectionRate}%, which is below target 50%. Connection strategy needs major revision.`,
//         steps: callConnectionRate > 50 ? [
//           'Implement structured follow-up: at least 2 attempts per candidate',
//           'Current follow-up rate appears to be 0% - start systematic follow-ups',
//           'Call at different times: morning (10-12), evening (4-6 PM)',
//           'Send SMS before calling to prepare candidates',
//           `Target: Increase connection rate to ${(parseFloat(callConnectionRate) + 10).toFixed(1)}% with follow-ups`
//         ] : [
//           'Critical: Review calling times - avoid early morning and late evening',
//           'Use local area codes instead of toll-free numbers',
//           'Implement 3-attempt calling strategy spread across different times',
//           'Send advance SMS notification about upcoming call',
//           'Leave professional voicemail with callback number and timings'
//         ]
//       });
//     }
    
//     if (stage.key === 'jotFormFilled') {
//       const formCompletionRate = ((stage.count / prevCount) * 100).toFixed(2);
      
//       suggestions.push({
//         type: formCompletionRate > 70 ? 'success' : 'warning',
//         icon: formCompletionRate > 70 ? CheckCircle : TrendingDown,
//         title: `Form Completion Rate: ${formCompletionRate}%`,
//         action: formCompletionRate > 70
//           ? `${formCompletionRate}% form completion is good, but can be optimized further with better UX and follow-ups.`
//           : `Only ${formCompletionRate}% completing the form. Significant improvement needed in form design and candidate support.`,
//         steps: formCompletionRate > 70 ? [
//           'Add progress indicator showing completion percentage',
//           'Send reminder after 6 hours if form incomplete',
//           'Provide help chat or WhatsApp support for form queries',
//           'Analyze drop-off points within the form',
//           'Aim for 85%+ completion rate with these improvements'
//         ] : [
//           'Critical: Reduce mandatory fields - keep only essential information',
//           'Enable mobile-friendly responsive form design',
//           'Add auto-save feature to prevent data loss',
//           'Send direct form link via SMS and email',
//           'Offer phone support for candidates facing form issues'
//         ]
//       });
//     }
    
//     // Good performance recognition
//     if (dropoff < 10 && idx > 0 && stage.count > 0) {
//       suggestions.push({
//         type: 'success',
//         icon: CheckCircle,
//         title: 'Excellent Stage Performance',
//         action: `Only ${dropoff.toFixed(2)}% dropoff with ${convRate}% overall conversion. This stage is performing excellently and should be used as benchmark.`,
//         steps: [
//           'Document what\'s working well at this stage',
//           'Share best practices with team for other stages',
//           'Continue monitoring to ensure consistency',
//           'Use this stage\'s process as template for struggling stages',
//           'Look for incremental 2-3% improvements through A/B testing'
//         ]
//       });
//     }
    
//     return suggestions.length > 0 ? suggestions : [{
//       type: 'info',
//       icon: Target,
//       title: 'Stage Analysis',
//       action: `This stage has ${stage.count} candidates with ${convRate}% conversion rate.`,
//       steps: [
//         'Continue monitoring stage performance',
//         'Track week-over-week trends',
//         'Set specific improvement targets',
//         'Gather candidate feedback at this stage'
//       ]
//     }];
//   };

//   return (
//     <div className="space-y-4">
//       {/* Filters */}
//       <div className="bg-white rounded shadow-sm p-4">
//         <div className="flex items-center gap-2 mb-3">
//           <Filter className="h-4 w-4" />
//           <h3 className="text-sm font-medium">Filters</h3>
//           <span className="text-xs text-gray-500">({filteredData.length} of {data.length} candidates)</span>
//           <button 
//             onClick={() => setSelectedFilters({
//               platform: 'all',
//               assignTo: 'all',
//               currentStage: 'all',
//               experience: 'all',
//               position: 'all',
//               dateFrom: '',
//               dateTo: ''
//             })}
//             className="ml-auto text-xs text-blue-600 hover:text-blue-800"
//           >
//             Clear All
//           </button>
//         </div>
        
//         <div className="grid grid-cols-5 gap-2 mb-3">
//           <select 
//             value={selectedFilters.platform} 
//             onChange={(e) => setSelectedFilters({...selectedFilters, platform: e.target.value})} 
//             className="block w-full rounded border-gray-300 text-xs px-2 py-2"
//           >
//             {filterOptions.platforms.map(p => (
//               <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>
//             ))}
//           </select>
          
//           <select 
//             value={selectedFilters.assignTo} 
//             onChange={(e) => setSelectedFilters({...selectedFilters, assignTo: e.target.value})} 
//             className="block w-full rounded border-gray-300 text-xs px-2 py-2"
//           >
//             {filterOptions.assignees.map(a => (
//               <option key={a} value={a}>{a === 'all' ? 'All Recruiters' : a}</option>
//             ))}
//           </select>
          
//           <select 
//             value={selectedFilters.currentStage} 
//             onChange={(e) => setSelectedFilters({...selectedFilters, currentStage: e.target.value})} 
//             className="block w-full rounded border-gray-300 text-xs px-2 py-2"
//           >
//             {filterOptions.stages.map(s => (
//               <option key={s} value={s}>{s === 'all' ? 'All Stages' : s}</option>
//             ))}
//           </select>
          
//           <select 
//             value={selectedFilters.experience} 
//             onChange={(e) => setSelectedFilters({...selectedFilters, experience: e.target.value})} 
//             className="block w-full rounded border-gray-300 text-xs px-2 py-2"
//           >
//             {filterOptions.experiences.map(e => (
//               <option key={e} value={e}>{e === 'all' ? 'All Experience' : e}</option>
//             ))}
//           </select>
          
//           <select 
//             value={selectedFilters.position} 
//             onChange={(e) => setSelectedFilters({...selectedFilters, position: e.target.value})} 
//             className="block w-full rounded border-gray-300 text-xs px-2 py-2"
//           >
//             {filterOptions.positions.map(p => (
//               <option key={p} value={p}>{p === 'all' ? 'All Positions' : p}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-3">
//           <Calendar className="h-4 w-4 text-gray-500" />
//           <label className="text-xs text-gray-600">Date Range (Date of Apply):</label>
//           <input 
//             type="date" 
//             value={selectedFilters.dateFrom}
//             onChange={(e) => setSelectedFilters({...selectedFilters, dateFrom: e.target.value})}
//             className="block rounded border-gray-300 text-xs px-2 py-1"
//           />
//           <span className="text-xs text-gray-500">to</span>
//           <input 
//             type="date" 
//             value={selectedFilters.dateTo}
//             onChange={(e) => setSelectedFilters({...selectedFilters, dateTo: e.target.value})}
//             className="block rounded border-gray-300 text-xs px-2 py-1"
//           />
//           {(selectedFilters.dateFrom || selectedFilters.dateTo) && (
//             <button
//               onClick={() => setSelectedFilters({...selectedFilters, dateFrom: '', dateTo: ''})}
//               className="text-xs text-red-600 hover:text-red-800"
//             >
//               Clear Dates
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-4 gap-3">
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Total Candidates</p>
//               <p className="text-2xl font-bold text-gray-900">{stageCounts[0]?.count || 0}</p>
//             </div>
//             <Users className="h-8 w-8 text-blue-500" />
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Data Extracted</p>
//               <p className="text-2xl font-bold text-gray-900">{stageCounts[1]?.count || 0}</p>
//               <p className="text-xs text-green-600">{stageCounts[1]?.conversionRate}%</p>
//             </div>
//             <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
//               <span className="text-green-600 font-bold text-sm">1</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Messages Sent</p>
//               <p className="text-2xl font-bold text-gray-900">{stageCounts[2]?.count || 0}</p>
//               <p className="text-xs text-green-600">{stageCounts[2]?.conversionRate}%</p>
//             </div>
//             <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//               <span className="text-blue-600 font-bold text-sm">2</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">Joined</p>
//               <p className="text-2xl font-bold text-gray-900">{joinedStage.count}</p>
//               <p className="text-xs text-purple-600">{joinedStage.conversionRate}%</p>
//             </div>
//             <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
//               <span className="text-purple-600 font-bold text-sm">✓</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottleneck Alert */}
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//         <div className="flex items-start gap-3">
//           <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
//           <div className="flex-1">
//             <h3 className="text-sm font-semibold text-red-900 mb-1">Biggest Bottleneck Identified</h3>
//             <p className="text-sm text-red-800">
//               <strong>{bottleneck.name}</strong> - {bottleneck.dropoffPercent}% dropoff ({bottleneck.dropoff} candidates lost)
//             </p>
//             <p className="text-xs text-red-600 mt-1">{bottleneck.description}</p>
//           </div>
//         </div>
//       </div>

//       {/* Funnel Visualization with Suggestions */}
//       <div className="grid grid-cols-3 gap-4">
//         {/* Funnel - Takes 2/3 width */}
//         <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <h3 className="text-lg font-semibold mb-4">Recruitment Funnel - Complete Pipeline</h3>
          
//           <div className="space-y-2">
//             {stageCounts.map((stage, idx) => {
//               const maxCount = filteredData.length || 1;
//               const widthPercent = (stage.count / maxCount) * 100;
//               const isBottleneck = stage.name === bottleneck.name && parseFloat(stage.dropoffPercent) > 20;
//               const isHovered = hoveredStage === idx;
              
//               return (
//                 <div key={idx} className={`${isBottleneck ? 'bg-red-50 p-2 rounded' : ''}`}>
//                   <div className="flex items-center justify-between mb-1">
//                     <div className="flex items-center gap-2">
//                       <span className="text-lg">{stage.icon}</span>
//                       <span className="text-xs font-medium text-gray-700 w-4">{idx + 1}</span>
//                       <span className="text-sm font-medium text-gray-900">{stage.name}</span>
//                       <button
//                         onClick={() => setSelectedStageForSuggestions(selectedStageForSuggestions === idx ? null : idx)}
//                         className="ml-2 p-1 hover:bg-blue-100 rounded transition-colors"
//                         title="View suggestions"
//                       >
//                         <Lightbulb className="h-4 w-4 text-blue-600" />
//                       </button>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="text-sm font-bold text-gray-900">{stage.count}</span>
//                       <span className="text-xs text-gray-500 w-12 text-right">{stage.conversionRate}%</span>
//                       {idx > 0 && stage.dropoff > 0 && (
//                         <span className={`text-xs w-16 text-right ${
//                           parseFloat(stage.dropoffPercent) > 30 ? 'text-red-600 font-semibold' :
//                           parseFloat(stage.dropoffPercent) > 15 ? 'text-orange-600' :
//                           'text-gray-500'
//                         }`}>
//                           -{stage.dropoff} ({stage.dropoffPercent}%)
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div 
//                     className="relative h-8 bg-gray-100 rounded overflow-hidden cursor-pointer"
//                     onMouseEnter={() => setHoveredStage(idx)}
//                     onMouseLeave={() => setHoveredStage(null)}
//                   >
//                     <div 
//                       className={`h-full transition-all duration-300 ${
//                         isBottleneck ? 'bg-red-500' :
//                         stage.key === 'total' ? 'bg-blue-500' :
//                         stage.key === 'joined' ? 'bg-purple-500' :
//                         stage.key === 'workedFor90Days' ? 'bg-green-500' :
//                         'bg-blue-400'
//                       }`}
//                       style={{ width: `${widthPercent}%` }}
//                     >
//                       <div className="h-full flex items-center justify-end px-3">
//                         <span className="text-xs font-medium text-white">{stage.count}</span>
//                       </div>
//                     </div>
                    
//                     {/* Hover Tooltip */}
//                     {isHovered && (
//                       <div className="absolute top-full left-0 mt-2 bg-gray-900 text-white p-3 rounded shadow-lg z-10 w-full text-xs">
//                         <p className="font-semibold mb-2">{stage.description}</p>
                        
//                         {Object.keys(stage.platformBreakdown).length > 0 && (
//                           <div className="mb-2">
//                             <p className="font-semibold text-blue-300 mb-1">Platform Breakdown:</p>
//                             {Object.entries(stage.platformBreakdown)
//                               .sort((a, b) => b[1] - a[1])
//                               .slice(0, 5)
//                               .map(([platform, count]) => (
//                                 <div key={platform} className="flex justify-between">
//                                   <span>{platform}:</span>
//                                   <span className="font-bold">{count} ({((count / stage.count) * 100).toFixed(1)}%)</span>
//                                 </div>
//                               ))}
//                           </div>
//                         )}
                        
//                         {Object.keys(stage.recruiterBreakdown).length > 0 && (
//                           <div>
//                             <p className="font-semibold text-green-300 mb-1">Recruiter Breakdown:</p>
//                             {Object.entries(stage.recruiterBreakdown)
//                               .sort((a, b) => b[1] - a[1])
//                               .slice(0, 5)
//                               .map(([recruiter, count]) => (
//                                 <div key={recruiter} className="flex justify-between">
//                                   <span>{recruiter}:</span>
//                                   <span className="font-bold">{count} ({((count / stage.count) * 100).toFixed(1)}%)</span>
//                                 </div>
//                               ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Suggestions Panel - Takes 1/3 width */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <Lightbulb className="h-5 w-5 text-amber-500" />
//               <h3 className="text-sm font-semibold">Action Suggestions</h3>
//             </div>
//             {selectedStageForSuggestions !== null && (
//               <button
//                 onClick={() => setSelectedStageForSuggestions(null)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             )}
//           </div>

//           {selectedStageForSuggestions === null ? (
//             <div className="text-center py-8">
//               <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//               <p className="text-sm text-gray-500 mb-2">Select a stage to view improvement suggestions</p>
//               <p className="text-xs text-gray-400">Click the 💡 icon next to any stage</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-2xl">{stageCounts[selectedStageForSuggestions].icon}</span>
//                   <div>
//                     <h4 className="text-sm font-bold text-gray-900">
//                       {stageCounts[selectedStageForSuggestions].name}
//                     </h4>
//                     <p className="text-xs text-gray-600">
//                       {stageCounts[selectedStageForSuggestions].description}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-3 gap-2 mt-2">
//                   <div className="bg-white rounded p-2 text-center">
//                     <p className="text-xs text-gray-500">Count</p>
//                     <p className="text-lg font-bold text-blue-600">
//                       {stageCounts[selectedStageForSuggestions].count}
//                     </p>
//                   </div>
//                   <div className="bg-white rounded p-2 text-center">
//                     <p className="text-xs text-gray-500">Conv Rate</p>
//                     <p className="text-lg font-bold text-green-600">
//                       {stageCounts[selectedStageForSuggestions].conversionRate}%
//                     </p>
//                   </div>
//                   <div className="bg-white rounded p-2 text-center">
//                     <p className="text-xs text-gray-500">Dropoff</p>
//                     <p className="text-lg font-bold text-red-600">
//                       {stageCounts[selectedStageForSuggestions].dropoffPercent}%
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Dynamic Suggestions */}
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {getSuggestions(stageCounts[selectedStageForSuggestions], selectedStageForSuggestions).map((suggestion, idx) => (
//                   <div key={idx} className={`rounded-lg border-2 p-3 ${
//                     suggestion.type === 'critical' ? 'bg-red-50 border-red-300' :
//                     suggestion.type === 'warning' ? 'bg-amber-50 border-amber-300' :
//                     suggestion.type === 'success' ? 'bg-green-50 border-green-300' :
//                     'bg-blue-50 border-blue-300'
//                   }`}>
//                     <div className="flex items-start gap-2 mb-2">
//                       <suggestion.icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
//                         suggestion.type === 'critical' ? 'text-red-600' :
//                         suggestion.type === 'warning' ? 'text-amber-600' :
//                         suggestion.type === 'success' ? 'text-green-600' :
//                         'text-blue-600'
//                       }`} />
//                       <div className="flex-1">
//                         <h5 className={`text-sm font-bold mb-1 ${
//                           suggestion.type === 'critical' ? 'text-red-900' :
//                           suggestion.type === 'warning' ? 'text-amber-900' :
//                           suggestion.type === 'success' ? 'text-green-900' :
//                           'text-blue-900'
//                         }`}>
//                           {suggestion.title}
//                         </h5>
//                         <p className={`text-xs mb-2 ${
//                           suggestion.type === 'critical' ? 'text-red-800' :
//                           suggestion.type === 'warning' ? 'text-amber-800' :
//                           suggestion.type === 'success' ? 'text-green-800' :
//                           'text-blue-800'
//                         }`}>
//                           {suggestion.action}
//                         </p>
//                       </div>
//                     </div>
                    
//                     {suggestion.steps && suggestion.steps.length > 0 && (
//                       <div className="mt-2 space-y-1">
//                         <p className="text-xs font-semibold text-gray-700 mb-1">Action Steps:</p>
//                         {suggestion.steps.map((step, stepIdx) => (
//                           <div key={stepIdx} className="flex items-start gap-2 text-xs text-gray-700">
//                             <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" />
//                             <span>{step}</span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Platform & Recruiter Performance for Selected Stage */}
//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                 <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
//                   <Zap className="h-3 w-3" />
//                   Top Performers at This Stage
//                 </h5>
                
//                 <div className="space-y-2">
//                   {/* Top Platforms */}
//                   <div>
//                     <p className="text-xs font-medium text-blue-700 mb-1">Best Platforms:</p>
//                     <div className="space-y-1">
//                       {Object.entries(stageCounts[selectedStageForSuggestions].platformBreakdown)
//                         .sort((a, b) => b[1] - a[1])
//                         .slice(0, 3)
//                         .map(([platform, count]) => (
//                           <div key={platform} className="flex justify-between items-center text-xs bg-white rounded p-1.5">
//                             <span className="font-medium text-gray-700">{platform}</span>
//                             <span className="font-bold text-blue-600">{count}</span>
//                           </div>
//                         ))}
//                     </div>
//                   </div>

//                   {/* Top Recruiters */}
//                   <div>
//                     <p className="text-xs font-medium text-green-700 mb-1">Best Recruiters:</p>
//                     <div className="space-y-1">
//                       {Object.entries(stageCounts[selectedStageForSuggestions].recruiterBreakdown)
//                         .sort((a, b) => b[1] - a[1])
//                         .slice(0, 3)
//                         .map(([recruiter, count]) => (
//                           <div key={recruiter} className="flex justify-between items-center text-xs bg-white rounded p-1.5">
//                             <span className="font-medium text-gray-700">{recruiter}</span>
//                             <span className="font-bold text-green-600">{count}</span>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Tip */}
//               <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
//                 <div className="flex items-start gap-2">
//                   <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
//                     💡
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-xs font-semibold text-purple-900 mb-1">Data-Driven Insight</p>
//                     <p className="text-xs text-purple-800">
//                       {(() => {
//                         const stage = stageCounts[selectedStageForSuggestions];
//                         const dropoff = parseFloat(stage.dropoffPercent);
//                         const convRate = parseFloat(stage.conversionRate);
//                         const topPlatform = Object.entries(stage.platformBreakdown).sort((a,b) => b[1] - a[1])[0];
//                         const topRecruiter = Object.entries(stage.recruiterBreakdown).sort((a,b) => b[1] - a[1])[0];
                        
//                         if (stage.count === 0) {
//                           return `No data available for this stage. Enable data tracking and ensure mandatory field validation is active to get actionable insights.`;
//                         }
                        
//                         if (dropoff > 30) {
//                           const candidatesLost = stageCounts[selectedStageForSuggestions > 0 ? selectedStageForSuggestions - 1 : 0].count - stage.count;
//                           return `Critical: ${dropoff.toFixed(1)}% drop (${candidatesLost} candidates lost). Implement immediate intervention - automated reminders within 6 hours and direct phone follow-ups can recover 25-30% of dropoffs based on industry benchmarks.`;
//                         }
                        
//                         if (dropoff < 10 && selectedStageForSuggestions > 0) {
//                           return `Excellent: Only ${dropoff.toFixed(1)}% dropoff shows strong process efficiency. Document this workflow and replicate it across other stages. ${topRecruiter ? `${topRecruiter[0]}'s approach with ${topRecruiter[1]} candidates is worth studying.` : ''}`;
//                         }
                        
//                         if (convRate >= 20 && convRate < 25) {
//                           const gap = 25 - convRate;
//                           return `Near target: At ${convRate}%, you're ${gap.toFixed(1)}% away from the 25% benchmark. Reducing response time by 1 day typically improves conversion by 3-5%. Focus on speed to close this gap.`;
//                         }
                        
//                         if (topPlatform && topPlatform[1] > stage.count * 0.4) {
//                           const platformShare = ((topPlatform[1] / stage.count) * 100).toFixed(1);
//                           return `${topPlatform[0]} dominates with ${platformShare}% share at this stage. Consider allocating 60-70% of recruitment budget here for maximum ROI, while maintaining 2-3 backup platforms for diversity.`;
//                         }
                        
//                         if (Object.keys(stage.recruiterBreakdown).length === 1 && topRecruiter) {
//                           return `Single-recruiter bottleneck: ${topRecruiter[0]} handles all ${topRecruiter[1]} candidates. Average response time likely exceeds 3 days. Adding one more recruiter can reduce this to under 2 days and improve conversion by 15-20%.`;
//                         }
                        
//                         return `Monitor this stage weekly. ${convRate}% conversion with ${dropoff.toFixed(1)}% dropoff. Set incremental improvement target of +2-3% conversion for next month through consistent process optimization.`;
//                       })()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Stage Performance Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//         <h3 className="text-lg font-semibold mb-3">Stage-by-Stage Performance Analysis</h3>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs">
//             <thead>
//               <tr className="border-b-2 border-gray-300">
//                 <th className="text-left py-2 px-2 font-semibold text-gray-700">#</th>
//                 <th className="text-left py-2 px-2 font-semibold text-gray-700">Stage</th>
//                 <th className="text-right py-2 px-2 font-semibold text-gray-700">Count</th>
//                 <th className="text-right py-2 px-2 font-semibold text-gray-700">Conv Rate</th>
//                 <th className="text-right py-2 px-2 font-semibold text-gray-700">Dropoff</th>
//                 <th className="text-right py-2 px-2 font-semibold text-gray-700">Dropoff %</th>
//                 <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stageCounts.map((stage, idx) => (
//                 <tr 
//                   key={idx} 
//                   className={`border-b hover:bg-gray-50 cursor-pointer ${
//                     parseFloat(stage.dropoffPercent) > 30 ? 'bg-red-50' :
//                     parseFloat(stage.dropoffPercent) > 20 ? 'bg-amber-50' : ''
//                   }`}
//                   onClick={() => setSelectedStageForSuggestions(idx)}
//                 >
//                   <td className="py-2 px-2 text-gray-600">{idx + 1}</td>
//                   <td className="py-2 px-2">
//                     <div className="flex items-center gap-2">
//                       <span>{stage.icon}</span>
//                       <span className="font-medium text-gray-900">{stage.name}</span>
//                     </div>
//                   </td>
//                   <td className="py-2 px-2 text-right font-bold text-gray-900">{stage.count}</td>
//                   <td className="py-2 px-2 text-right">
//                     <span className={`font-semibold ${
//                       parseFloat(stage.conversionRate) > 70 ? 'text-green-600' :
//                       parseFloat(stage.conversionRate) > 40 ? 'text-blue-600' :
//                       parseFloat(stage.conversionRate) > 20 ? 'text-amber-600' :
//                       'text-red-600'
//                     }`}>
//                       {stage.conversionRate}%
//                     </span>
//                   </td>
//                   <td className="py-2 px-2 text-right text-gray-700">
//                     {idx > 0 ? stage.dropoff : '-'}
//                   </td>
//                   <td className="py-2 px-2 text-right">
//                     {idx > 0 && (
//                       <span className={`font-semibold ${
//                         parseFloat(stage.dropoffPercent) > 30 ? 'text-red-600' :
//                         parseFloat(stage.dropoffPercent) > 15 ? 'text-amber-600' :
//                         'text-green-600'
//                       }`}>
//                         {stage.dropoffPercent}%
//                       </span>
//                     )}
//                   </td>
//                   <td className="py-2 px-2 text-center">
//                     {idx === 0 ? (
//                       <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
//                         Start
//                       </span>
//                     ) : parseFloat(stage.dropoffPercent) > 30 ? (
//                       <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
//                         Critical
//                       </span>
//                     ) : parseFloat(stage.dropoffPercent) > 15 ? (
//                       <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
//                         Warning
//                       </span>
//                     ) : (
//                       <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
//                         Good
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Platform & Recruiter Comparison */}
//       <div className="grid grid-cols-2 gap-4">
//         {/* Platform Breakdown */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//             <div className="w-3 h-3 bg-blue-500 rounded"></div>
//             Platform Performance Across Stages
//           </h3>
          
//           <div className="space-y-2 max-h-80 overflow-y-auto">
//             {filterOptions.platforms
//               .filter(p => p !== 'all')
//               .map(platform => {
//                 const platformData = stageCounts.map(stage => ({
//                   stage: stage.name,
//                   count: stage.platformBreakdown[platform] || 0
//                 }));
//                 const totalCount = platformData[0]?.count || 0;
//                 const finalCount = platformData[platformData.length - 1]?.count || 0;
//                 const convRate = totalCount > 0 ? ((finalCount / totalCount) * 100).toFixed(1) : '0.0';
                
//                 return (
//                   <div key={platform} className="border border-gray-200 rounded p-2">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-sm font-semibold text-gray-900">{platform}</span>
//                       <div className="text-right">
//                         <span className="text-xs text-gray-500">Conv: </span>
//                         <span className="text-sm font-bold text-blue-600">{convRate}%</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                       <span>Started: {totalCount}</span>
//                       <span>→</span>
//                       <span>Final: {finalCount}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>

//         {/* Recruiter Breakdown */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//             <div className="w-3 h-3 bg-green-500 rounded"></div>
//             Recruiter Performance Across Stages
//           </h3>
          
//           <div className="space-y-2 max-h-80 overflow-y-auto">
//             {filterOptions.assignees
//               .filter(a => a !== 'all')
//               .map(recruiter => {
//                 const recruiterData = stageCounts.map(stage => ({
//                   stage: stage.name,
//                   count: stage.recruiterBreakdown[recruiter] || 0
//                 }));
//                 const totalCount = recruiterData[0]?.count || 0;
//                 const finalCount = recruiterData[recruiterData.length - 1]?.count || 0;
//                 const convRate = totalCount > 0 ? ((finalCount / totalCount) * 100).toFixed(1) : '0.0';
                
//                 return (
//                   <div key={recruiter} className="border border-gray-200 rounded p-2">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-sm font-semibold text-gray-900">{recruiter}</span>
//                       <div className="text-right">
//                         <span className="text-xs text-gray-500">Conv: </span>
//                         <span className="text-sm font-bold text-green-600">{convRate}%</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                       <span>Started: {totalCount}</span>
//                       <span>→</span>
//                       <span>Final: {finalCount}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </div>

//       {/* Footer Summary */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-4 text-white">
//         <div className="grid grid-cols-5 gap-4">
//           <div className="text-center">
//             <p className="text-xs opacity-90 mb-1">Overall Conversion</p>
//             <p className="text-2xl font-bold">{joinedStage.conversionRate}%</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs opacity-90 mb-1">Total Stages</p>
//             <p className="text-2xl font-bold">{stageCounts.length}</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs opacity-90 mb-1">Critical Stages</p>
//             <p className="text-2xl font-bold">
//               {stageCounts.filter(s => parseFloat(s.dropoffPercent) > 30).length}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs opacity-90 mb-1">Active Filters</p>
//             <p className="text-2xl font-bold">
//               {Object.values(selectedFilters).filter(v => v && v !== 'all').length}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs opacity-90 mb-1">Candidates</p>
//             <p className="text-2xl font-bold">{filteredData.length}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecruitmentFunnel;
import React, { useState, useMemo } from 'react';
import { TrendingDown, Users, Filter, Calendar, Lightbulb, X, ChevronRight, AlertTriangle, CheckCircle, TrendingUp as TrendingUpIcon, Target, Zap, Clipboard, 
  Database, Send, Phone, FileEdit, FileCheck, ListTodo, Mic, ClipboardCheck, CheckCheck, Search, CheckSquare, PartyPopper, Rocket, Menu, BarChart3, Award, Clock } from 'lucide-react';

const RecruitmentFunnel = ({ data }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    platform: 'all',
    assignTo: 'all',
    currentStage: 'all',
    experience: 'all',
    position: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [hoveredStage, setHoveredStage] = useState(null);
  const [selectedStageForSuggestions, setSelectedStageForSuggestions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  // Define funnel stages
  const funnelStages = [
    { name: 'Data Extraction', key: 'dateOfApply', description: 'Date of Apply filled', icon: Database },
    { name: 'Bulk Message Sending', key: 'messageSent', description: 'Message Sent', icon: Send },
    { name: 'First Call', key: 'firstConnectedCall', description: 'First Connected Call', icon: Phone },
    { name: 'Jotform Submission', key: 'jotFormFilled', description: 'Jot form filled', icon: FileEdit },
    { name: 'Sign Doc Received', key: 'signDocReceived', description: 'Sign Doc Received', icon: FileCheck },
    { name: 'Task Assigned', key: 'taskAssigned', description: 'Task Assigned', icon: ListTodo },
    { name: 'Voice Note Submitted', key: 'voiceNoteSubmitted1', description: 'Voice Note Submitted', icon: Mic },
    { name: 'Voice Note Approved', key: 'voiceNoteApproved', description: 'Voice Note Approved', icon: CheckCircle },
    { name: 'Eligibility Task Sub', key: 'eligibilityTaskSubmitted1', description: 'Task Submitted', icon: ClipboardCheck },
    { name: 'Eligibility Approved', key: 'eligibilityTaskApproved', description: 'Task Approved', icon: CheckCheck },
    { name: 'Interview Scheduled', key: 'interviewDoneAtOffice', description: 'Interview Done', icon: Target },
    { name: 'Trial Scheduled', key: 'trialScheduled', description: 'Trial Scheduled', icon: Search },
    { name: 'Trial Done', key: 'trialDone', description: 'Trial Done', icon: CheckSquare },
    { name: 'Joined', key: 'joined', description: 'Joined', icon: PartyPopper },
    { name: 'Worked 90 Days', key: 'workedFor90Days', description: 'Worked 90 Days', icon: Rocket }
  ];

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (selectedFilters.platform !== 'all' && item.platform !== selectedFilters.platform) return false;
      if (selectedFilters.assignTo !== 'all' && item.assignTo !== selectedFilters.assignTo) return false;
      if (selectedFilters.currentStage !== 'all' && item.currentStage !== selectedFilters.currentStage) return false;
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

  const filterOptions = useMemo(() => ({
    platforms: ['all', ...new Set(data.map(d => d.platform).filter(Boolean))],
    assignees: ['all', ...new Set(data.map(d => d.assignTo).filter(Boolean))],
    stages: ['all', ...new Set(data.map(d => d.currentStage).filter(Boolean))],
    experiences: ['all', 'Fresher', '1-3 years', '3-5 years', '5+ years'],
    positions: ['all', ...new Set(data.map(d => d.position).filter(Boolean))]
  }), [data]);

  // Calculate stage counts with platform and recruiter breakdown
  const initialCounts = funnelStages.map((stage) => {
    let count = 0;
    const platformBreakdown = {};
    const recruiterBreakdown = {};
    const candidatesList = [];
    
    filteredData.forEach(d => {
      let isInStage = false;
      
      if (stage.key === 'total') {
        isInStage = true;
      } else if (stage.key === 'dateOfApply') {
        isInStage = d.dateOfApply && d.dateOfApply !== '' && d.dateOfApply !== '-';
      } else {
        isInStage = d[stage.key] && d[stage.key] !== '' && d[stage.key] !== '-';
      }
      
      if (isInStage) {
        count++;
        candidatesList.push(d);
        
        const platform = d.platform || 'Unknown';
        const recruiter = d.assignTo || 'Unassigned';
        
        platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
        recruiterBreakdown[recruiter] = (recruiterBreakdown[recruiter] || 0) + 1;
      }
    });
    
    return {
      ...stage,
      count,
      platformBreakdown,
      recruiterBreakdown,
      candidatesList
    };
  });

  // Second pass: Calculate dropoff and conversion rates
  const stageCounts = initialCounts.map((stage, idx) => {
    const prevCount = idx > 0 ? initialCounts[idx - 1].count : filteredData.length;
    const dropoff = prevCount - stage.count;
    const dropoffPercent = prevCount > 0 ? ((dropoff / prevCount) * 100).toFixed(1) : '0.0';
    const conversionRate = filteredData.length > 0 ? ((stage.count / filteredData.length) * 100).toFixed(1) : '0.0';
    
    return {
      ...stage,
      dropoff,
      dropoffPercent,
      conversionRate
    };
  });

  // Find biggest bottleneck
  const bottleneck = stageCounts.reduce((max, stage) => 
    parseFloat(stage.dropoffPercent) > parseFloat(max.dropoffPercent) ? stage : max
  , stageCounts[0] || { dropoffPercent: '0.0', name: 'None', dropoff: 0 });

  const joinedStage = stageCounts.find(s => s.key === 'joined') || { count: 0, conversionRate: '0.0' };

  // Calculate additional metrics
  const metrics = useMemo(() => {
    const totalCandidates = filteredData.length;
    const messagesStage = stageCounts.find(s => s.key === 'messageSent') || { count: 0 };
    const callStage = stageCounts.find(s => s.key === 'firstConnectedCall') || { count: 0 };
    const formStage = stageCounts.find(s => s.key === 'jotFormFilled') || { count: 0 };
    
    const messageRate = totalCandidates > 0 ? ((messagesStage.count / totalCandidates) * 100).toFixed(1) : '0.0';
    const callRate = messagesStage.count > 0 ? ((callStage.count / messagesStage.count) * 100).toFixed(1) : '0.0';
    const formRate = callStage.count > 0 ? ((formStage.count / callStage.count) * 100).toFixed(1) : '0.0';
    
    const criticalStages = stageCounts.filter(s => parseFloat(s.dropoffPercent) > 30).length;
    const warningStages = stageCounts.filter(s => parseFloat(s.dropoffPercent) > 15 && parseFloat(s.dropoffPercent) <= 30).length;
    const healthyStages = stageCounts.filter(s => parseFloat(s.dropoffPercent) <= 15).length - 1; // Exclude first stage
    
    return {
      messageRate,
      callRate,
      formRate,
      criticalStages,
      warningStages,
      healthyStages
    };
  }, [stageCounts]);

  // Generate dynamic suggestions
  const getSuggestions = (stage, idx) => {
    const suggestions = [];
    const dropoff = parseFloat(stage.dropoffPercent);
    const convRate = parseFloat(stage.conversionRate);
    const prevCount = idx > 0 ? stageCounts[idx - 1].count : filteredData.length;
    
    if (stage.count === 0 && idx > 0) {
      suggestions.push({
        type: 'critical',
        icon: AlertTriangle,
        title: 'No Data Available for Analysis',
        action: `This stage shows 0 candidates. Data may be missing or this stage is not being tracked properly.`,
        steps: [
          'Verify if this stage is active in your recruitment process',
          'Check data entry fields for this stage in your system',
          'Ensure mandatory field validation is enabled',
          'Review if candidates are being properly transitioned to this stage',
          'Consider removing this stage from funnel if not applicable'
        ]
      });
      return suggestions;
    }

    const platformEntries = Object.entries(stage.platformBreakdown).sort((a, b) => b[1] - a[1]);
    const topPlatform = platformEntries[0];
    const totalPlatformCandidates = stage.count;
    
    if (platformEntries.length > 1 && topPlatform) {
      const topPlatformConvRate = ((topPlatform[1] / totalPlatformCandidates) * 100).toFixed(2);
      const topPlatformName = topPlatform[0];
      const topPlatformCount = topPlatform[1];
      
      suggestions.push({
        type: 'info',
        icon: Target,
        title: 'Platform Performance Insights',
        action: `${topPlatformName} is leading with ${topPlatformCount} candidates (${topPlatformConvRate}% of this stage). ${platformEntries.length > 1 ? `Other platforms: ${platformEntries.slice(1, 3).map(p => `${p[0]} (${p[1]})`).join(', ')}.` : ''}`,
        steps: [
          `Prioritize ${topPlatformName} for future recruitment drives`,
          `Analyze why ${topPlatformName} performs better than others`,
          `Increase listing frequency on ${topPlatformName}`,
          platformEntries.length > 2 ? `Evaluate ROI of underperforming platforms: ${platformEntries.slice(-2).map(p => p[0]).join(', ')}` : 'Monitor platform diversity',
          `Set platform-specific conversion targets based on ${topPlatformName}'s performance`
        ]
      });
    }

    const recruiterEntries = Object.entries(stage.recruiterBreakdown).sort((a, b) => b[1] - a[1]);
    const topRecruiter = recruiterEntries[0];
    
    if (recruiterEntries.length > 1 && topRecruiter) {
      const topRecruiterConvRate = ((topRecruiter[1] / stage.count) * 100).toFixed(2);
      const recruiterWorkload = Object.values(stage.recruiterBreakdown);
      const avgWorkload = recruiterWorkload.reduce((a, b) => a + b, 0) / recruiterWorkload.length;
      const workloadVariance = Math.max(...recruiterWorkload) - Math.min(...recruiterWorkload);
      
      suggestions.push({
        type: recruiterEntries.length === 1 ? 'warning' : 'info',
        icon: Users,
        title: recruiterEntries.length === 1 ? 'Single Recruiter Handling All Load' : 'Recruiter Performance Distribution',
        action: recruiterEntries.length === 1 
          ? `${topRecruiter[0]} is handling all ${topRecruiter[1]} candidates alone. Consider load balancing to improve response time and reduce burnout risk.`
          : `${topRecruiter[0]} leads with ${topRecruiter[1]} candidates (${topRecruiterConvRate}%). Workload variance is ${workloadVariance} candidates across ${recruiterEntries.length} recruiters.`,
        steps: recruiterEntries.length === 1 ? [
          'Introduce task automation to reduce manual workload',
          'Add additional recruiter support during peak periods',
          'Implement automated reminders and follow-up systems',
          'Monitor response time metrics closely',
          'Set up alerts for bottlenecks in candidate pipeline'
        ] : [
          `Learn best practices from ${topRecruiter[0]}'s approach`,
          workloadVariance > avgWorkload ? 'Rebalance candidate distribution for fair workload' : 'Maintain current workload distribution',
          'Conduct knowledge sharing sessions among recruiters',
          'Set individual performance targets based on capacity',
          'Implement peer mentoring for underperforming recruiters'
        ]
      });
    }
    
    if (dropoff > 30) {
      const candidatesLost = prevCount - stage.count;
      const targetRetention = Math.ceil(candidatesLost * 0.3);
      
      suggestions.push({
        type: 'critical',
        icon: AlertTriangle,
        title: 'Critical Leakage Point Identified',
        action: `There is a ${dropoff.toFixed(2)}% drop from previous stage, losing ${candidatesLost} candidates. This is a major bottleneck requiring immediate attention.`,
        steps: [
          `Target: Retain at least ${targetRetention} more candidates (30% improvement) at this stage`,
          `Implement automated reminders 24 hours after previous stage completion`,
          `Reduce time gap between stages - aim for same-day transitions`,
          `Conduct exit surveys to understand dropout reasons`,
          `Simplify requirements and provide clear step-by-step guidance`
        ]
      });
    } else if (dropoff > 20) {
      const candidatesLost = prevCount - stage.count;
      
      suggestions.push({
        type: 'warning',
        icon: TrendingDown,
        title: 'Moderate Dropoff Detected',
        action: `${dropoff.toFixed(2)}% dropoff losing ${candidatesLost} candidates. This needs optimization to improve conversion efficiency.`,
        steps: [
          `Set target to reduce dropoff below 15% in next cycle`,
          `Implement follow-up calls within 48 hours`,
          `Send interest confirmation messages and reminders`,
          `Analyze top 3 reasons for dropout at this stage`,
          `Create FAQ document to address common concerns`
        ]
      });
    }
    
    if (convRate >= 20 && convRate < 25) {
      const gap = (25 - convRate).toFixed(2);
      const candidatesNeeded = Math.ceil((filteredData.length * 0.25) - stage.count);
      
      suggestions.push({
        type: 'info',
        icon: TrendingUpIcon,
        title: 'Near Target Performance',
        action: `Achieving ${convRate}% conversion, close to the 25% target with only ${gap}% gap. Good progress with scope for improvement.`,
        steps: [
          `Need ${candidatesNeeded} more successful candidates to hit 25% target`,
          `Implement faster follow-ups - reduce response time by 1 day`,
          `Increase communication frequency at earlier stages`,
          `Focus on high-intent candidates identified in initial screening`,
          `Expected to achieve target within next recruitment cycle with these changes`
        ]
      });
    } else if (convRate >= 15 && convRate < 20) {
      suggestions.push({
        type: 'warning',
        icon: Target,
        title: 'Below Target Conversion',
        action: `Current ${convRate}% conversion is ${(20 - convRate).toFixed(2)}% below minimum 20% target. Immediate process improvements needed.`,
        steps: [
          `Review entire funnel for bottlenecks causing low conversion`,
          `Improve candidate quality at sourcing stage`,
          `Implement multi-channel communication (SMS, Email, Call)`,
          `Set up daily performance monitoring and alerts`,
          `Consider revising eligibility criteria if too restrictive`
        ]
      });
    } else if (convRate >= 25) {
      suggestions.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Exceeding Target Performance',
        action: `Excellent ${convRate}% conversion rate, exceeding the 25% target by ${(convRate - 25).toFixed(2)}%. Strong performance to maintain and replicate.`,
        steps: [
          `Document current processes as best practices`,
          `Share successful strategies with entire recruitment team`,
          `Maintain quality while exploring capacity to scale up`,
          `Set new stretch target of ${(convRate * 1.1).toFixed(1)}% for next cycle`,
          `Monitor consistency - ensure performance doesn't decline`
        ]
      });
    }
    
    if (stage.key === 'messageSent') {
      const messageDeliveryRate = stage.count > 0 ? ((stage.count / prevCount) * 100).toFixed(2) : 0;
      
      suggestions.push({
        type: messageDeliveryRate > 90 ? 'success' : 'warning',
        icon: messageDeliveryRate > 90 ? CheckCircle : AlertTriangle,
        title: messageDeliveryRate > 90 ? 'High Message Delivery Rate' : 'Message Delivery Issues',
        action: messageDeliveryRate > 90 
          ? `Achieving ${messageDeliveryRate}% message delivery rate, which is excellent. This shows the messaging system is effective and reliable.`
          : `Only ${messageDeliveryRate}% messages delivered successfully. This needs immediate attention to improve reach.`,
        steps: messageDeliveryRate > 90 ? [
          'Maintain current messaging infrastructure',
          'Use same method for follow-up and reminder campaigns',
          'A/B test message content for better engagement',
          'Track message open rates and response times',
          'Scale up messaging volume with confidence'
        ] : [
          'Verify contact numbers and update invalid entries',
          'Switch to more reliable messaging service provider',
          'Implement phone number validation at data entry',
          'Send test messages before bulk campaigns',
          'Set up delivery failure alerts and retry mechanism'
        ]
      });
    }
    
    if (stage.key === 'firstConnectedCall') {
      const callConnectionRate = ((stage.count / prevCount) * 100).toFixed(2);
      
      suggestions.push({
        type: callConnectionRate > 50 ? 'success' : 'critical',
        icon: callConnectionRate > 50 ? CheckCircle : AlertTriangle,
        title: `Call Connection Rate: ${callConnectionRate}%`,
        action: callConnectionRate > 50 
          ? `Call success rate of ${callConnectionRate}% is above 50%, showing good connection rates. Follow-up strategy can further improve this.`
          : `Call success rate is only ${callConnectionRate}%, which is below target 50%. Connection strategy needs major revision.`,
        steps: callConnectionRate > 50 ? [
          'Implement structured follow-up: at least 2 attempts per candidate',
          'Current follow-up rate appears to be 0% - start systematic follow-ups',
          'Call at different times: morning (10-12), evening (4-6 PM)',
          'Send SMS before calling to prepare candidates',
          `Target: Increase connection rate to ${(parseFloat(callConnectionRate) + 10).toFixed(1)}% with follow-ups`
        ] : [
          'Critical: Review calling times - avoid early morning and late evening',
          'Use local area codes instead of toll-free numbers',
          'Implement 3-attempt calling strategy spread across different times',
          'Send advance SMS notification about upcoming call',
          'Leave professional voicemail with callback number and timings'
        ]
      });
    }
    
    if (stage.key === 'jotFormFilled') {
      const formCompletionRate = ((stage.count / prevCount) * 100).toFixed(2);
      
      suggestions.push({
        type: formCompletionRate > 70 ? 'success' : 'warning',
        icon: formCompletionRate > 70 ? CheckCircle : TrendingDown,
        title: `Form Completion Rate: ${formCompletionRate}%`,
        action: formCompletionRate > 70
          ? `${formCompletionRate}% form completion is good, but can be optimized further with better UX and follow-ups.`
          : `Only ${formCompletionRate}% completing the form. Significant improvement needed in form design and candidate support.`,
        steps: formCompletionRate > 70 ? [
          'Add progress indicator showing completion percentage',
          'Send reminder after 6 hours if form incomplete',
          'Provide help chat or WhatsApp support for form queries',
          'Analyze drop-off points within the form',
          'Aim for 85%+ completion rate with these improvements'
        ] : [
          'Critical: Reduce mandatory fields - keep only essential information',
          'Enable mobile-friendly responsive form design',
          'Add auto-save feature to prevent data loss',
          'Send direct form link via SMS and email',
          'Offer phone support for candidates facing form issues'
        ]
      });
    }
    
    if (dropoff < 10 && idx > 0 && stage.count > 0) {
      suggestions.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Excellent Stage Performance',
        action: `Only ${dropoff.toFixed(2)}% dropoff with ${convRate}% overall conversion. This stage is performing excellently and should be used as benchmark.`,
        steps: [
          'Document what\'s working well at this stage',
          'Share best practices with team for other stages',
          'Continue monitoring to ensure consistency',
          'Use this stage\'s process as template for struggling stages',
          'Look for incremental 2-3% improvements through A/B testing'
        ]
      });
    }
    
    return suggestions.length > 0 ? suggestions : [{
      type: 'info',
      icon: Target,
      title: 'Stage Analysis',
      action: `This stage has ${stage.count} candidates with ${convRate}% conversion rate.`,
      steps: [
        'Continue monitoring stage performance',
        'Track week-over-week trends',
        'Set specific improvement targets',
        'Gather candidate feedback at this stage'
      ]
    }];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                <TrendingUpIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-xl font-black text-gray-900 truncate">Recruitment Funnel</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Complete funnel analysis with stage-wise insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-700" />
            <h3 className="text-sm font-bold text-gray-900">Filters</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full hidden sm:inline">
              {filteredData.length} of {data.length} records
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-semibold shadow-md transition-all"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button 
              onClick={() => setSelectedFilters({
                platform: 'all',
                assignTo: 'all',
                currentStage: 'all',
                experience: 'all',
                position: 'all',
                dateFrom: '',
                dateTo: ''
              })}
              className="text-xs text-red-600 hover:text-red-800 font-semibold"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-1.5 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
            >
              {showFilters ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-3`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <select 
              value={selectedFilters.platform} 
              onChange={(e) => setSelectedFilters({...selectedFilters, platform: e.target.value})} 
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
            >
              {filterOptions.platforms.map(p => (
                <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>
              ))}
            </select>
            
            <select 
              value={selectedFilters.assignTo} 
              onChange={(e) => setSelectedFilters({...selectedFilters, assignTo: e.target.value})} 
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
            >
              {filterOptions.assignees.map(a => (
                <option key={a} value={a}>{a === 'all' ? 'All Recruiters' : a}</option>
              ))}
            </select>
            
            <select 
              value={selectedFilters.currentStage} 
              onChange={(e) => setSelectedFilters({...selectedFilters, currentStage: e.target.value})} 
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
            >
              {filterOptions.stages.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Stages' : s}</option>
              ))}
            </select>
            
            <select 
              value={selectedFilters.experience} 
              onChange={(e) => setSelectedFilters({...selectedFilters, experience: e.target.value})} 
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
            >
              {filterOptions.experiences.map(e => (
                <option key={e} value={e}>{e === 'all' ? 'All Experience' : e}</option>
              ))}
            </select>
            
            <select 
              value={selectedFilters.position} 
              onChange={(e) => setSelectedFilters({...selectedFilters, position: e.target.value})} 
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
            >
              {filterOptions.positions.map(p => (
                <option key={p} value={p}>{p === 'all' ? 'All Positions' : p}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <Calendar className="h-4 w-4 text-gray-500 hidden md:block" />
            <label className="text-xs text-gray-600 font-medium">Date Range:</label>
            <input 
              type="date" 
              value={selectedFilters.dateFrom}
              onChange={(e) => setSelectedFilters({...selectedFilters, dateFrom: e.target.value})}
              className="block w-full md:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
            />
            <span className="text-xs text-gray-500 hidden md:inline">to</span>
            <input 
              type="date" 
              value={selectedFilters.dateTo}
              onChange={(e) => setSelectedFilters({...selectedFilters, dateTo: e.target.value})}
              className="block w-full md:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
            />
            {(selectedFilters.dateFrom || selectedFilters.dateTo) && (
              <button
                onClick={() => setSelectedFilters({...selectedFilters, dateFrom: '', dateTo: ''})}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 md:p-4 rounded-lg shadow-lg border-2 border-blue-400">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-blue-100 mb-1">Total Candidates</p>
              <p className="text-xl md:text-2xl font-bold text-white">{filteredData.length}</p>
            </div>
            <Users className="h-7 w-7 md:h-8 md:w-8 text-blue-100" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 md:p-4 rounded-lg shadow-lg border-2 border-green-400">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-green-100 mb-1">Data Extracted</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stageCounts[0]?.count || 0}</p>
              <p className="text-xs text-green-100 font-medium">{stageCounts[0]?.conversionRate}%</p>
            </div>
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
              <span className="text-white font-bold text-sm">1</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 md:p-4 rounded-lg shadow-lg border-2 border-purple-400">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-purple-100 mb-1">Messages Sent</p>
              <p className="text-xl md:text-2xl font-bold text-white">{stageCounts[1]?.count || 0}</p>
              <p className="text-xs text-purple-100 font-medium">{stageCounts[1]?.conversionRate}%</p>
            </div>
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
              <span className="text-white font-bold text-sm">2</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 md:p-4 rounded-lg shadow-lg border-2 border-amber-400">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-amber-100 mb-1">Joined</p>
              <p className="text-xl md:text-2xl font-bold text-white">{joinedStage.count}</p>
              <p className="text-xs text-amber-100 font-medium">{joinedStage.conversionRate}%</p>
            </div>
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* New Performance Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-gray-700">Message Rate</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{metrics.messageRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Delivery success</p>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-green-600" />
            <span className="text-xs font-semibold text-gray-700">Call Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{metrics.callRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Connection success</p>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FileEdit className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-semibold text-gray-700">Form Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{metrics.formRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Completion rate</p>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold text-gray-700">Overall Conv</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{joinedStage.conversionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">End-to-end</p>
        </div>
      </div>

      {/* Stage Health Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border-2 border-red-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-2xl font-bold text-red-700">{metrics.criticalStages}</span>
          </div>
          <p className="text-xs font-semibold text-red-800">Critical Stages</p>
          <p className="text-xs text-red-600 mt-1">&gt;30% dropoff</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border-2 border-amber-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="text-2xl font-bold text-amber-700">{metrics.warningStages}</span>
          </div>
          <p className="text-xs font-semibold text-amber-800">Warning Stages</p>
          <p className="text-xs text-amber-600 mt-1">15-30% dropoff</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border-2 border-green-300 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold text-green-700">{metrics.healthyStages}</span>
          </div>
          <p className="text-xs font-semibold text-green-800">Healthy Stages</p>
          <p className="text-xs text-green-600 mt-1">&lt;15% dropoff</p>
        </div>
      </div>

      {/* Bottleneck Alert */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-lg p-3 md:p-4 shadow-md">
        <div className="flex items-start gap-3">
          <TrendingDown className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-red-900 mb-1">🚨 Biggest Bottleneck Identified</h3>
            <p className="text-sm text-red-800 break-words">
              <strong>{bottleneck.name}</strong> - {bottleneck.dropoffPercent}% dropoff ({bottleneck.dropoff} candidates lost)
            </p>
            <p className="text-xs text-red-600 mt-1">{bottleneck.description}</p>
          </div>
        </div>
      </div>

      {/* Funnel Visualization - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Funnel - Takes full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-900">Recruitment Funnel - Complete Pipeline</h3>
          
          <div className="space-y-2">
            {stageCounts.map((stage, idx) => {
              const maxCount = filteredData.length || 1;
              const widthPercent = (stage.count / maxCount) * 100;
              const isBottleneck = stage.name === bottleneck.name && parseFloat(stage.dropoffPercent) > 20;
              const isHovered = hoveredStage === idx;
              const StageIcon = stage.icon;
              
              return (
                <div key={idx} className={`${isBottleneck ? 'bg-red-50 p-2 rounded-lg border border-red-200' : ''}`}>
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
                      <StageIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-700 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-700 flex-shrink-0">{idx + 1}</span>
                      <span className="text-xs md:text-sm font-medium text-gray-900 truncate">{stage.name}</span>
                      <button
                        onClick={() => {
                          setSelectedStageForSuggestions(selectedStageForSuggestions === idx ? null : idx);
                          setShowMobileSuggestions(true);
                        }}
                        className="p-1 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                        title="View suggestions"
                      >
                        <Lightbulb className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900">{stage.count}</span>
                      <span className="text-xs text-gray-500 w-10 md:w-12 text-right">{stage.conversionRate}%</span>
                      {idx > 0 && stage.dropoff > 0 && (
                        <span className={`text-xs w-12 md:w-16 text-right ${
                          parseFloat(stage.dropoffPercent) > 30 ? 'text-red-600 font-semibold' :
                          parseFloat(stage.dropoffPercent) > 15 ? 'text-orange-600' :
                          'text-gray-500'
                        }`}>
                          -{stage.dropoff} ({stage.dropoffPercent}%)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className="relative h-6 md:h-8 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onMouseEnter={() => setHoveredStage(idx)}
                    onMouseLeave={() => setHoveredStage(null)}
                    onClick={() => setHoveredStage(hoveredStage === idx ? null : idx)}
                  >
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isBottleneck ? 'bg-red-500' :
                        stage.key === 'total' ? 'bg-blue-500' :
                        stage.key === 'joined' ? 'bg-purple-500' :
                        stage.key === 'workedFor90Days' ? 'bg-green-500' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      <div className="h-full flex items-center justify-end px-2 md:px-3">
                        <span className="text-xs font-medium text-white">{stage.count}</span>
                      </div>
                    </div>
                    
                    {/* Hover Tooltip - Mobile optimized */}
                    {isHovered && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-10 text-xs">
                        <p className="font-semibold mb-2">{stage.description}</p>
                        
                        {Object.keys(stage.platformBreakdown).length > 0 && (
                          <div className="mb-2">
                            <p className="font-semibold text-blue-300 mb-1">Platform Breakdown:</p>
                            <div className="space-y-0.5">
                              {Object.entries(stage.platformBreakdown)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 3)
                                .map(([platform, count]) => (
                                  <div key={platform} className="flex justify-between">
                                    <span className="truncate mr-2">{platform}:</span>
                                    <span className="font-bold flex-shrink-0">{count} ({((count / stage.count) * 100).toFixed(1)}%)</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {Object.keys(stage.recruiterBreakdown).length > 0 && (
                          <div>
                            <p className="font-semibold text-green-300 mb-1">Recruiter Breakdown:</p>
                            <div className="space-y-0.5">
                              {Object.entries(stage.recruiterBreakdown)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 3)
                                .map(([recruiter, count]) => (
                                  <div key={recruiter} className="flex justify-between">
                                    <span className="truncate mr-2">{recruiter}:</span>
                                    <span className="font-bold flex-shrink-0">{count} ({((count / stage.count) * 100).toFixed(1)}%)</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions Panel - Hidden on mobile initially, shown as modal */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-semibold text-gray-900">Action Suggestions</h3>
            </div>
            {selectedStageForSuggestions !== null && (
              <button
                onClick={() => setSelectedStageForSuggestions(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {selectedStageForSuggestions === null ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-2">Select a stage to view improvement suggestions</p>
              <p className="text-xs text-gray-400">Click the 💡 icon next to any stage</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {(() => {
                const SelectedStageIcon = stageCounts[selectedStageForSuggestions].icon;
                return (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200 sticky top-0 z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <SelectedStageIcon className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {stageCounts[selectedStageForSuggestions].name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {stageCounts[selectedStageForSuggestions].description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Count</p>
                        <p className="text-lg font-bold text-blue-600">
                          {stageCounts[selectedStageForSuggestions].count}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Conv Rate</p>
                        <p className="text-lg font-bold text-green-600">
                          {stageCounts[selectedStageForSuggestions].conversionRate}%
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Dropoff</p>
                        <p className="text-lg font-bold text-red-600">
                          {stageCounts[selectedStageForSuggestions].dropoffPercent}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Dynamic Suggestions */}
              <div className="space-y-3">
                {getSuggestions(stageCounts[selectedStageForSuggestions], selectedStageForSuggestions).map((suggestion, idx) => {
                  const SuggestionIcon = suggestion.icon;
                  return (
                    <div key={idx} className={`rounded-lg border-2 p-3 ${
                      suggestion.type === 'critical' ? 'bg-red-50 border-red-300' :
                      suggestion.type === 'warning' ? 'bg-amber-50 border-amber-300' :
                      suggestion.type === 'success' ? 'bg-green-50 border-green-300' :
                      'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="flex items-start gap-2 mb-2">
                        <SuggestionIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          suggestion.type === 'critical' ? 'text-red-600' :
                          suggestion.type === 'warning' ? 'text-amber-600' :
                          suggestion.type === 'success' ? 'text-green-600' :
                          'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <h5 className={`text-sm font-bold mb-1 ${
                            suggestion.type === 'critical' ? 'text-red-900' :
                            suggestion.type === 'warning' ? 'text-amber-900' :
                            suggestion.type === 'success' ? 'text-green-900' :
                            'text-blue-900'
                          }`}>
                            {suggestion.title}
                          </h5>
                          <p className={`text-xs mb-2 ${
                            suggestion.type === 'critical' ? 'text-red-800' :
                            suggestion.type === 'warning' ? 'text-amber-800' :
                            suggestion.type === 'success' ? 'text-green-800' :
                            'text-blue-800'
                          }`}>
                            {suggestion.action}
                          </p>
                        </div>
                      </div>
                      
                      {suggestion.steps && suggestion.steps.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Action Steps:</p>
                          {suggestion.steps.map((step, stepIdx) => (
                            <div key={stepIdx} className="flex items-start gap-2 text-xs text-gray-700">
                              <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Top Performers */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Top Performers at This Stage
                </h5>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-blue-700 mb-1">Best Platforms:</p>
                    <div className="space-y-1">
                      {Object.entries(stageCounts[selectedStageForSuggestions].platformBreakdown)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([platform, count]) => (
                          <div key={platform} className="flex justify-between items-center text-xs bg-white rounded p-1.5">
                            <span className="font-medium text-gray-700 truncate">{platform}</span>
                            <span className="font-bold text-blue-600 ml-2">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1">Best Recruiters:</p>
                    <div className="space-y-1">
                      {Object.entries(stageCounts[selectedStageForSuggestions].recruiterBreakdown)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([recruiter, count]) => (
                          <div key={recruiter} className="flex justify-between items-center text-xs bg-white rounded p-1.5">
                            <span className="font-medium text-gray-700 truncate">{recruiter}</span>
                            <span className="font-bold text-green-600 ml-2">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Suggestions Modal */}
      {showMobileSuggestions && selectedStageForSuggestions !== null && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-semibold text-gray-900">Suggestions</h3>
              </div>
              <button
                onClick={() => {
                  setShowMobileSuggestions(false);
                  setSelectedStageForSuggestions(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {(() => {
                const SelectedStageIcon = stageCounts[selectedStageForSuggestions].icon;
                return (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <SelectedStageIcon className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {stageCounts[selectedStageForSuggestions].name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {stageCounts[selectedStageForSuggestions].description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Count</p>
                        <p className="text-lg font-bold text-blue-600">
                          {stageCounts[selectedStageForSuggestions].count}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Conv</p>
                        <p className="text-lg font-bold text-green-600">
                          {stageCounts[selectedStageForSuggestions].conversionRate}%
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500">Drop</p>
                        <p className="text-lg font-bold text-red-600">
                          {stageCounts[selectedStageForSuggestions].dropoffPercent}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {getSuggestions(stageCounts[selectedStageForSuggestions], selectedStageForSuggestions).map((suggestion, idx) => {
                const SuggestionIcon = suggestion.icon;
                return (
                  <div key={idx} className={`rounded-lg border-2 p-3 ${
                    suggestion.type === 'critical' ? 'bg-red-50 border-red-300' :
                    suggestion.type === 'warning' ? 'bg-amber-50 border-amber-300' :
                    suggestion.type === 'success' ? 'bg-green-50 border-green-300' :
                    'bg-blue-50 border-blue-300'
                  }`}>
                    <div className="flex items-start gap-2 mb-2">
                      <SuggestionIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        suggestion.type === 'critical' ? 'text-red-600' :
                        suggestion.type === 'warning' ? 'text-amber-600' :
                        suggestion.type === 'success' ? 'text-green-600' :
                        'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <h5 className={`text-sm font-bold mb-1 ${
                          suggestion.type === 'critical' ? 'text-red-900' :
                          suggestion.type === 'warning' ? 'text-amber-900' :
                          suggestion.type === 'success' ? 'text-green-900' :
                          'text-blue-900'
                        }`}>
                          {suggestion.title}
                        </h5>
                        <p className={`text-xs mb-2 ${
                          suggestion.type === 'critical' ? 'text-red-800' :
                          suggestion.type === 'warning' ? 'text-amber-800' :
                          suggestion.type === 'success' ? 'text-green-800' :
                          'text-blue-800'
                        }`}>
                          {suggestion.action}
                        </p>
                      </div>
                    </div>
                    
                    {suggestion.steps && suggestion.steps.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Action Steps:</p>
                        {suggestion.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="flex items-start gap-2 text-xs text-gray-700">
                            <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stage Performance Table - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-900">Stage-by-Stage Performance</h3>
        
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 px-2 font-semibold text-gray-700">#</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-700">Stage</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Count</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700 hidden sm:table-cell">Conv</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-700">Drop%</th>
                <th className="text-center py-2 px-2 font-semibold text-gray-700 hidden md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {stageCounts.map((stage, idx) => {
                const TableStageIcon = stage.icon;
                return (
                  <tr 
                    key={idx} 
                    className={`border-b hover:bg-gray-50 cursor-pointer ${
                      parseFloat(stage.dropoffPercent) > 30 ? 'bg-red-50' :
                      parseFloat(stage.dropoffPercent) > 20 ? 'bg-amber-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedStageForSuggestions(idx);
                      setShowMobileSuggestions(true);
                    }}
                  >
                    <td className="py-2 px-2 text-gray-600">{idx + 1}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1.5">
                        <TableStageIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900 text-xs truncate">{stage.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-gray-900">{stage.count}</td>
                    <td className="py-2 px-2 text-right hidden sm:table-cell">
                      <span className={`font-semibold ${
                        parseFloat(stage.conversionRate) > 70 ? 'text-green-600' :
                        parseFloat(stage.conversionRate) > 40 ? 'text-blue-600' :
                        parseFloat(stage.conversionRate) > 20 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {stage.conversionRate}%
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">
                      {idx > 0 && (
                        <span className={`font-semibold ${
                          parseFloat(stage.dropoffPercent) > 30 ? 'text-red-600' :
                          parseFloat(stage.dropoffPercent) > 15 ? 'text-amber-600' :
                          'text-green-600'
                        }`}>
                          {stage.dropoffPercent}%
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-center hidden md:table-cell">
                      {idx === 0 ? (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          Start
                        </span>
                      ) : parseFloat(stage.dropoffPercent) > 30 ? (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          Critical
                        </span>
                      ) : parseFloat(stage.dropoffPercent) > 15 ? (
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                          Warning
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Good
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform & Recruiter Comparison - Mobile Optimized */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-900">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            Platform Performance
          </h3>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filterOptions.platforms
              .filter(p => p !== 'all')
              .map(platform => {
                const platformData = stageCounts.map(stage => ({
                  stage: stage.name,
                  count: stage.platformBreakdown[platform] || 0
                }));
                const totalCount = platformData[0]?.count || 0;
                const finalCount = platformData[platformData.length - 1]?.count || 0;
                const convRate = totalCount > 0 ? ((finalCount / totalCount) * 100).toFixed(1) : '0.0';
                
                return (
                  <div key={platform} className="border border-gray-200 rounded-lg p-2.5 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">{platform}</span>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs text-gray-500">Conv: </span>
                        <span className="text-sm font-bold text-blue-600">{convRate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>Start: {totalCount}</span>
                      <ChevronRight className="h-3 w-3" />
                      <span>End: {finalCount}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-900">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            Recruiter Performance
          </h3>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filterOptions.assignees
              .filter(a => a !== 'all')
              .map(recruiter => {
                const recruiterData = stageCounts.map(stage => ({
                  stage: stage.name,
                  count: stage.recruiterBreakdown[recruiter] || 0
                }));
                const totalCount = recruiterData[0]?.count || 0;
                const finalCount = recruiterData[recruiterData.length - 1]?.count || 0;
                const convRate = totalCount > 0 ? ((finalCount / totalCount) * 100).toFixed(1) : '0.0';
                
                return (
                  <div key={recruiter} className="border border-gray-200 rounded-lg p-2.5 hover:border-green-300 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">{recruiter}</span>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs text-gray-500">Conv: </span>
                        <span className="text-sm font-bold text-green-600">{convRate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>Start: {totalCount}</span>
                      <ChevronRight className="h-3 w-3" />
                      <span>End: {finalCount}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Footer Summary - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-3 md:p-4 text-white">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <div className="text-center">
            <p className="text-xs opacity-90 mb-1">Overall Conv</p>
            <p className="text-xl md:text-2xl font-bold">{joinedStage.conversionRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-90 mb-1">Total Stages</p>
            <p className="text-xl md:text-2xl font-bold">{stageCounts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-90 mb-1">Critical</p>
            <p className="text-xl md:text-2xl font-bold">
              {stageCounts.filter(s => parseFloat(s.dropoffPercent) > 30).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-90 mb-1">Filters</p>
            <p className="text-xl md:text-2xl font-bold">
              {Object.values(selectedFilters).filter(v => v && v !== 'all').length}
            </p>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <p className="text-xs opacity-90 mb-1">Candidates</p>
            <p className="text-xl md:text-2xl font-bold">{filteredData.length}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RecruitmentFunnel;