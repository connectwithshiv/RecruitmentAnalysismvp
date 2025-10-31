import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Area, AreaChart, ScatterChart, Scatter } from 'recharts';
import { Users, TrendingUp, CheckCircle, Clock, Filter, Activity, AlertCircle, RefreshCw, Brain, Target, Award, Zap, TrendingDown, Calendar, X, Menu, BarChart3, Star } from 'lucide-react';

const CombinedRecruitmentDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('overview');
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
  const [selectedStageForActions, setSelectedStageForActions] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtUrPdD86EPgpEjuxE2kHBemma9CArZHqLX1MrWynV13ofw2cNdsvC3QLMZAiCLptrMdKNa2hAzG_R/pub?output=csv";

  const parseCSV = (text) => {
    const rows = [];
    let cur = "", row = [], inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i], nxt = text[i + 1];
      if (ch === '"' && inQuotes && nxt === '"') { cur += '"'; i++; continue; }
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { row.push(cur); cur = ""; continue; }
      if ((ch === "\n" || ch === "\r") && !inQuotes) {
        if (ch === "\r" && nxt === "\n") i++;
        row.push(cur); rows.push(row); row = []; cur = ""; continue;
      }
      cur += ch;
    }
    if (cur !== "" || row.length > 0) { row.push(cur); rows.push(row); }
    return rows.map(r => r.map(c => (c == null ? "" : c.trim())));
  };

  const parseDateSafe = (s) => {
    if (!s || s === "" || s === "-") return null;
    let dt = new Date(s);
    if (!isNaN(dt) && dt.getFullYear() > 2000 && dt.getFullYear() < 2030) return dt;
    const parts = s.split("/");
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10), m = parseInt(parts[1], 10) - 1, y = parseInt(parts[2], 10);
      dt = new Date(y, m, d);
      if (!isNaN(dt) && dt.getFullYear() > 2000 && dt.getFullYear() < 2030) return dt;
    }
    return null;
  };

  const hasDate = (value) => value && value !== "" && value !== "-" && parseDateSafe(value) !== null;
  const countNonEmpty = (arr) => arr.filter(item => item && item !== '').length;

  const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const median = (arr) => {
    if (!arr.length) return 0;
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
  };
  const mode = (arr) => {
    if (!arr.length) return null;
    const freq = {};
    let maxFreq = 0, modes = [];
    arr.forEach(val => {
      freq[val] = (freq[val] || 0) + 1;
      if (freq[val] > maxFreq) { maxFreq = freq[val]; modes = [val]; }
      else if (freq[val] === maxFreq) modes.push(val);
    });
    return modes[0];
  };
  const stddev = (arr) => {
    if (!arr.length) return 0;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length);
  };
  const variance = (arr) => {
    if (!arr.length) return 0;
    const m = mean(arr);
    return arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length;
  };
  const range = (arr) => arr.length ? Math.max(...arr) - Math.min(...arr) : 0;
  const iqr = (arr) => percentile(arr, 75) - percentile(arr, 25);
  const cv = (arr) => {
    const m = mean(arr);
    return m === 0 ? 0 : (stddev(arr) / m) * 100;
  };
  const percentile = (arr, p) => {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index), upper = Math.ceil(index), weight = index % 1;
    return lower === upper ? sorted[lower] : sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const getWeekKey = (date) => {
    if (!date || !(date instanceof Date)) return "unknown";
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  };

  const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const getDaysDiff = (date1, date2) => {
    if (!date1 || !date2) return null;
    const diff = Math.abs(date2 - date1);
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(CSV_URL);
        if (!res.ok) throw new Error("Failed to fetch CSV");
        const text = await res.text();
        const parsed = parseCSV(text);
        
        if (!parsed.length) { setData([]); return; }
        
        const headers = parsed[0].map(h => h || "");
        const rows = parsed.slice(1).filter(r => r.some(c => c !== ""));
        
        const processed = rows.map((r, idx) => {
          const obj = {};
          headers.forEach((h, i) => { obj[h] = r[i] != null ? r[i] : ""; });
          
          const expStr = (obj.Exp || "").replace(/[^\d.]/g, "");
          const exp = parseFloat(expStr);
          
          const rawData = {
            ...obj,
            id: idx + 1,
            name: obj.Name || '',
            position: obj.Position || '',
            contact: obj.Contact || '',
            platform: obj.Platform || '',
            dateOfApply: obj.DateofApply || '',
            exp: !isNaN(exp) ? exp : 0,
            assignTo: obj.AssignTo || '',
            dateOfDataGiven: obj.Dateofdatagiven || '',
            remarks: obj.Remarks || ''
          };

          const statusFields = {
            messageSent: obj["Message Sent"] || '',
            reminderMsg1: obj["Reminder Message -1 ( To be send 2Nd day)"] || '',
            reminderMsg2: obj["Reminder Message -2 (To be 4th day)"] || '',
            reminderMsg3: obj["Reminder Message -3 (To be send 15days)"] || '',
            reminderMsg4: obj["Reminder Message -4"] || '',
            reminderMsg5: obj["Reminder Message -5 ( TO be send 1 month)"] || '',
            firstConnectedCall: obj["Candidate - First Connected Call"] || '',
            secondConnectedCall: obj["Candidate - 2ndConnected Call"] || '',
            thirdConnectedCall: obj["Candidate - 3rdConnected Call"] || '',
            fourthConnectedCall: obj["Candidate - 4rdConnected Call"] || '',
            messageNotReceived: obj["Message not received"] || '',
            repliedNotGettingResponse1: obj["replied not getting response"] || '',
            rejected1: obj["Rejected"] || '',
            willSubmitJotForm: obj["Will Submit Jot Form"] || '',
            notConnected1: obj["Not Connected"] || '',
            jotFormFilled: obj["Jot form filled"] || '',
            secondMsgAfterJotForm: obj["2nd msg gone after Jot form filled"] || '',
            thirdMsgAfterJotForm: obj["3rd msg gone after Jot form filled"] || '',
            fourthMsgAfterJotForm: obj["4th msg gone after Jot form filled"] || '',
            signDocReceived: obj["Sign Doc Recived"] || '',
            trialScheduledAtOffice: obj["Trial Scheduled at Office"] || '',
            willSubmitVoiceNote: obj["Will Submit Voice Note"] || '',
            taskAssigned: obj["Task Assigned"] || '',
            voiceNoteSubmitted1: obj["Voice note submitted - 1"] || '',
            correctionsVoiceNote1: obj["Corrections Given in Voice Note - 1"] || '',
            voiceNoteSubmitted2: obj["Voice note submitted - 2"] || '',
            correctionsVoiceNote2: obj["Corrections Given in Voice Note - 2"] || '',
            voiceNoteSubmitted3: obj["Voice note submitted - 3"] || '',
            correctionsVoiceNote3: obj["Corrections Given in Voice Note - 3"] || '',
            voiceNoteSubmitted4: obj["Voice note submitted - 4"] || '',
            correctionsVoiceNote4: obj["Corrections Given in Voice Note - 4"] || '',
            voiceNoteApproved: obj["Voice Note Approved"] || '',
            eligibilityTaskSubmitted1: obj["Eligibility Task Submitted"] || '',
            eligibilityTaskSubmitted2: obj["Eligibility Task Submitted - 2"] || '',
            eligibilityTaskSubmitted3: obj["Eligibility Task Submitted - 3"] || '',
            correctionsEligibilityTask3: obj["Corrections Given in Eligibility Task - 3"] || '',
            correctionsEligibilityTask5: obj["Corrections Given in Eligibility Task - 5"] || '',
            eligibilityTaskApproved: obj["Eligibility Task Approved"] || '',
            interviewDoneAtOffice: obj["Interview Done At office"] || '',
            interviewTakenAtOffice: obj["Interview Taken at Office"] || '',
            doubtsCleared1: obj["Doubts Cleared"] || '',
            trialScheduled: obj["Trial Sceduled"] || '',
            notReachedForTrial: obj["Not Reached for an Trial"] || '',
            doubtsCleared2: obj["Doubts cleared"] || '',
            doubtsCleared3: obj["Doubts Cleared"] || '',
            trialDone: obj["Trial Done"] || '',
            joined: obj["Joined"] || '',
            workedFor90Days: obj["Worked For 90 days"] || '',
            reviewAfter1Week: obj["Review after 1 week"] || '',
            reviewAfter4Week: obj["Review after 4 week"] || '',
            notAvailable: obj["Notavaialble"] || '',
            callBackLater: obj["CallBacklater"] || '',
            willInform: obj["Willinform"] || '',
            canComeInterview: obj["Cancomeinterview"] || '',
            notInterested: obj["Not interested"] || '',
            cantDoEligibilityTask: obj["Cant do eligibility task"] || '',
            formLinkNotOpening: obj["Formlinknotopening"] || '',
            refusedToPerformTrial: obj["refused to perform Trial"] || '',
            refusedForJoining: obj["refused for Joining"] || ''
          };

          const totalCalls = countNonEmpty([statusFields.firstConnectedCall, statusFields.secondConnectedCall, statusFields.thirdConnectedCall, statusFields.fourthConnectedCall]);
          const totalMessages = countNonEmpty([statusFields.messageSent, statusFields.reminderMsg1, statusFields.reminderMsg2, statusFields.reminderMsg3, statusFields.reminderMsg4, statusFields.reminderMsg5, statusFields.secondMsgAfterJotForm, statusFields.thirdMsgAfterJotForm, statusFields.fourthMsgAfterJotForm]);
          const totalReminders = countNonEmpty([statusFields.reminderMsg1, statusFields.reminderMsg2, statusFields.reminderMsg3, statusFields.reminderMsg4, statusFields.reminderMsg5]);
          const voiceNoteSubmissions = countNonEmpty([statusFields.voiceNoteSubmitted1, statusFields.voiceNoteSubmitted2, statusFields.voiceNoteSubmitted3, statusFields.voiceNoteSubmitted4]);
          const voiceNoteCorrections = countNonEmpty([statusFields.correctionsVoiceNote1, statusFields.correctionsVoiceNote2, statusFields.correctionsVoiceNote3, statusFields.correctionsVoiceNote4]);
          const eligibilityTaskSubmissions = countNonEmpty([statusFields.eligibilityTaskSubmitted1, statusFields.eligibilityTaskSubmitted2, statusFields.eligibilityTaskSubmitted3]);
          const eligibilityTaskCorrections = countNonEmpty([statusFields.correctionsEligibilityTask3, statusFields.correctionsEligibilityTask5]);

          let currentStage = 'New';
          if (statusFields.workedFor90Days) currentStage = 'Worked 90 Days';
          else if (statusFields.joined) currentStage = 'Joined';
          else if (statusFields.trialDone) currentStage = 'Trial Done';
          else if (statusFields.trialScheduled || statusFields.trialScheduledAtOffice) currentStage = 'Trial Scheduled';
          else if (statusFields.interviewTakenAtOffice) currentStage = 'Interview Completed';
          else if (statusFields.interviewDoneAtOffice) currentStage = 'Interview Scheduled';
          else if (statusFields.eligibilityTaskApproved) currentStage = 'Task Approved';
          else if (statusFields.eligibilityTaskSubmitted1 || statusFields.eligibilityTaskSubmitted2 || statusFields.eligibilityTaskSubmitted3) currentStage = 'Task Submitted';
          else if (statusFields.voiceNoteApproved) currentStage = 'Voice Note Approved';
          else if (statusFields.voiceNoteSubmitted1 || statusFields.voiceNoteSubmitted2 || statusFields.voiceNoteSubmitted3 || statusFields.voiceNoteSubmitted4) currentStage = 'Voice Note Submitted';
          else if (statusFields.taskAssigned) currentStage = 'Task Assigned';
          else if (statusFields.signDocReceived) currentStage = 'Sign Doc Received';
          else if (statusFields.jotFormFilled) currentStage = 'Form Filled';
          else if (statusFields.willSubmitJotForm) currentStage = 'Awaiting Form';
          else if (statusFields.refusedForJoining) currentStage = 'Rejected - Refused Joining';
          else if (statusFields.refusedToPerformTrial) currentStage = 'Rejected - Refused Trial';
          else if (statusFields.notInterested) currentStage = 'Rejected - Not Interested';
          else if (statusFields.cantDoEligibilityTask) currentStage = 'Rejected - Cannot Do Task';
          else if (statusFields.messageNotReceived) currentStage = 'Rejected - No Response';
          else if (statusFields.notAvailable) currentStage = 'Rejected - Not Available';
          else if (statusFields.rejected1) currentStage = 'Rejected';
          else if (statusFields.firstConnectedCall || statusFields.secondConnectedCall || statusFields.thirdConnectedCall || statusFields.fourthConnectedCall) currentStage = 'In Communication';
          else if (statusFields.messageSent) currentStage = 'Initial Contact';

          const dateApply = parseDateSafe(rawData.dateOfApply);
          const dateDataGiven = parseDateSafe(rawData.dateOfDataGiven);
          const dateJotFormFilled = parseDateSafe(statusFields.jotFormFilled);
          const dateJoined = parseDateSafe(statusFields.joined);
          const dateFirstCall = parseDateSafe(statusFields.firstConnectedCall);

          const daysInPipeline = dateApply ? getDaysDiff(dateApply, new Date()) : 0;
          const daysToFirstContact = (dateApply && dateFirstCall) ? getDaysDiff(dateApply, dateFirstCall) : null;
          const daysToJotForm = (dateApply && dateJotFormFilled) ? getDaysDiff(dateApply, dateJotFormFilled) : null;
          const daysToHire = (dateApply && dateJoined) ? getDaysDiff(dateApply, dateJoined) : null;

          const totalTouchpoints = totalCalls + totalMessages + voiceNoteSubmissions + eligibilityTaskSubmissions;

          let engagementScore = 0;
          if (statusFields.messageSent && statusFields.firstConnectedCall) engagementScore += 20;
          if (statusFields.jotFormFilled) engagementScore += 20;
          if (statusFields.signDocReceived) engagementScore += 15;
          if (statusFields.voiceNoteSubmitted1) engagementScore += 10;
          if (statusFields.eligibilityTaskSubmitted1) engagementScore += 10;
          if (statusFields.interviewDoneAtOffice) engagementScore += 5;
          if (statusFields.trialDone) engagementScore += 5;

          return {
            ...rawData,
            ...statusFields,
            totalCalls,
            totalMessages,
            totalReminders,
            voiceNoteSubmissions,
            voiceNoteCorrections,
            eligibilityTaskSubmissions,
            eligibilityTaskCorrections,
            currentStage,
            daysInPipeline,
            daysToFirstContact,
            daysToJotForm,
            daysToHire,
            totalTouchpoints,
            engagementScore,
            dateApplyDate: dateApply,
            dateDataGivenDate: dateDataGiven,
            dateJotFormFilledDate: dateJotFormFilled,
            dateJoinedDate: dateJoined,
            dateFirstCallDate: dateFirstCall,
            jotFormFilledBool: hasDate(statusFields.jotFormFilled),
            rejectedBool: hasDate(statusFields.rejected1),
            notConnectedBool: hasDate(statusFields.notConnected1),
            messageSentBool: hasDate(statusFields.messageSent),
            firstCallBool: hasDate(statusFields.firstConnectedCall),
            joinedBool: hasDate(statusFields.joined)
          };
        });
        
        setData(processed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
        if (item.dateApplyDate < filterDateFrom) return false;
      }
      if (selectedFilters.dateTo && item.dateApplyDate) {
        const filterDateTo = new Date(selectedFilters.dateTo);
        filterDateTo.setHours(23, 59, 59, 999);
        if (item.dateApplyDate > filterDateTo) return false;
      }
      
      return true;
    });
  }, [data, selectedFilters]);

  const analytics = useMemo(() => {
    const workingData = filteredData;
    if (!workingData.length) return null;
    
    const metrics = {
      totalCandidates: workingData.length,
      uniquePositions: new Set(workingData.map(d => d.position).filter(Boolean)).size,
      uniquePlatforms: new Set(workingData.map(d => d.platform).filter(Boolean)).size,
      totalRecruiters: new Set(workingData.map(d => d.assignTo).filter(Boolean)).size,
      
      jotFormFilledCount: workingData.filter(d => d.jotFormFilledBool).length,
      willSubmitJotFormCount: workingData.filter(d => d.willSubmitJotForm).length,
      rejectedCount: workingData.filter(d => d.rejectedBool).length,
      notConnectedCount: workingData.filter(d => d.notConnectedBool).length,
      messageNotReceivedCount: workingData.filter(d => d.messageNotReceived).length,
      messageSentCount: workingData.filter(d => d.messageSentBool).length,
      firstCallCount: workingData.filter(d => d.firstCallBool).length,
      signDocReceivedCount: workingData.filter(d => d.signDocReceived).length,
      voiceNoteApprovedCount: workingData.filter(d => d.voiceNoteApproved).length,
      eligibilityTaskApprovedCount: workingData.filter(d => d.eligibilityTaskApproved).length,
      interviewDoneCount: workingData.filter(d => d.interviewDoneAtOffice || d.interviewTakenAtOffice).length,
      trialScheduledCount: workingData.filter(d => d.trialScheduled || d.trialScheduledAtOffice).length,
      trialDoneCount: workingData.filter(d => d.trialDone).length,
      joinedCount: workingData.filter(d => d.joinedBool).length,
      worked90DaysCount: workingData.filter(d => d.workedFor90Days).length,
      
      avgExp: 0, medianExp: 0, modeExp: 0, minExp: 0, maxExp: 0,
      expRange: 0, expStdDev: 0, expVariance: 0, expIQR: 0, expCV: 0,
      exp25thPercentile: 0, exp75thPercentile: 0, exp90thPercentile: 0,
      countExpGreater3: 0, countExpGreater5: 0,
      countFreshers: 0, countMidLevel: 0, countSenior: 0,
      expDistribution: {},
      
      avgDaysToFirstContact: 0, avgDaysToJotForm: 0, avgDaysToHire: 0,
      avgDaysInPipeline: 0, medianResponseTime: 0,
      fastestResponse: 0, slowestResponse: 0,
      responseTimeDistribution: {},
      
      candidatesPerPlatform: {}, platformPercent: {},
      conversionRatePerPlatform: {}, rejectionRatePerPlatform: {},
      notConnectedPerPlatform: {}, msgNotReceivedPerPlatform: {},
      avgExpPerPlatform: {}, responseTimePerPlatform: {},
      platformEfficiency: {}, platformROI: {},
      platformQualityScore: {}, platformVelocity: {},
      topPlatform: null, bottomPlatform: null,
      
      candidatesPerRecruiter: {}, conversionPerRecruiter: {},
      rejectionPerRecruiter: {}, avgExpPerRecruiter: {},
      responseTimePerRecruiter: {}, recruiterEfficiency: {},
      recruiterWorkload: {}, recruiterQualityScore: {},
      recruiterVelocity: {}, recruiterConsistency: {},
      topRecruiter: null, bottomRecruiter: null,
      
      funnelByPlatform: {},
      funnelByRecruiter: {},
      
      applicationsPerDay: {}, applicationsPerWeek: {}, applicationsPerMonth: {},
      conversionsByWeek: {}, rejectionsByWeek: {},
      avgDailyApplications: 0, peakApplicationDay: null, lowApplicationDay: null,
      
      applicationsByDayOfWeek: {}, conversionsByDayOfWeek: {},
      bestDayForApplications: null, bestDayForConversions: null,
      
      funnelStages: { applied: 0, contacted: 0, responded: 0, interested: 0, converted: 0 },
      stageConversionRates: {}, dropoffRates: {},
      
      communicationSuccessRate: 0, avgCommunicationAttempts: 0,
      responseRate: 0, engagementScore: 0,
      messageSuccess: 0, callSuccess: 0, followUpRate: 0,
      
      conversionPredictors: {}, rejectionPredictors: {},
      seasonalityIndex: {}, trendDirection: null,
      
      callsPerHire: 0, messagesPerHire: 0, touchpointsPerHire: 0,
      avgDaysToHireMetric: 0, conversionRate: 0, rejectionRate: 0,
      costPerHire: 0, totalRecruitmentCost: 0, pipelineVelocity: 0,
      avgCallsPerCandidate: 0, avgMessagesPerCandidate: 0,
      avgTouchpointsPerCandidate: 0, activeInPipeline: 0,
      
      dataCompleteness: 0, missingFieldsPercent: 0,
      dataQualityScore: 0, qualityOfHire: 0,
      
      positionDiversity: 0, platformDiversity: 0, experienceDiversity: 0,
      
      recruitmentHealthScore: 0, talentPoolQuality: 0, processEffectiveness: 0,
      overallEfficiency: 0, resourceUtilization: 0, timeToFill: 0,
      
      expectedConversionsNextWeek: 0, riskScore: 0, opportunityScore: 0,
      
      internalBenchmarks: {}, performanceGaps: {},
      
      candidateSourceMix: {}, rejectionReasons: {},
      communicationChannelEffectiveness: {},
      recruiterSpecialization: {}, positionDifficulty: {},
      candidateQualityBySource: {}, timeInStageAnalysis: {},
      bottleneckIdentification: {}, capacityAnalysis: {},
      forecastAccuracy: 0,
      
      overallRecruitmentScore: 0, dataQualityIndex: 0,
      processMaturityLevel: 0, strategicAlignment: 0
    };

    const exps = workingData.map(d => d.exp).filter(e => e > 0);
    if (exps.length) {
      metrics.avgExp = mean(exps);
      metrics.medianExp = median(exps);
      metrics.modeExp = mode(exps);
      metrics.minExp = Math.min(...exps);
      metrics.maxExp = Math.max(...exps);
      metrics.expRange = range(exps);
      metrics.expStdDev = stddev(exps);
      metrics.expVariance = variance(exps);
      metrics.expIQR = iqr(exps);
      metrics.expCV = cv(exps);
      metrics.exp25thPercentile = percentile(exps, 25);
      metrics.exp75thPercentile = percentile(exps, 75);
      metrics.exp90thPercentile = percentile(exps, 90);
      
      metrics.countFreshers = workingData.filter(d => d.exp === 0).length;
      metrics.countMidLevel = workingData.filter(d => d.exp > 0 && d.exp <= 3).length;
      metrics.countSenior = workingData.filter(d => d.exp > 3).length;
      metrics.countExpGreater3 = workingData.filter(d => d.exp > 3).length;
      metrics.countExpGreater5 = workingData.filter(d => d.exp > 5).length;
      
      exps.forEach(e => {
        const bucket = Math.floor(e);
        metrics.expDistribution[bucket] = (metrics.expDistribution[bucket] || 0) + 1;
      });
    }

    const daysToFirstContactArr = workingData.map(d => d.daysToFirstContact).filter(t => t !== null && t >= 0);
    const daysToJotFormArr = workingData.map(d => d.daysToJotForm).filter(t => t !== null && t >= 0);
    const daysToHireArr = workingData.map(d => d.daysToHire).filter(t => t !== null && t >= 0);
    const pipelineTimes = workingData.map(d => d.daysInPipeline).filter(t => t >= 0);

    if (daysToFirstContactArr.length) {
      metrics.avgDaysToFirstContact = mean(daysToFirstContactArr);
      metrics.medianResponseTime = median(daysToFirstContactArr);
      metrics.fastestResponse = Math.min(...daysToFirstContactArr);
      metrics.slowestResponse = Math.max(...daysToFirstContactArr);
      
      daysToFirstContactArr.forEach(t => {
        const bucket = t <= 1 ? '0-1 days' : t <= 3 ? '2-3 days' : t <= 7 ? '4-7 days' : t <= 14 ? '8-14 days' : '15+ days';
        metrics.responseTimeDistribution[bucket] = (metrics.responseTimeDistribution[bucket] || 0) + 1;
      });
    }

    if (daysToJotFormArr.length) {
      metrics.avgDaysToJotForm = mean(daysToJotFormArr);
    }

    if (daysToHireArr.length) {
      metrics.avgDaysToHire = mean(daysToHireArr);
      metrics.avgDaysToHireMetric = mean(daysToHireArr);
      metrics.timeToFill = mean(daysToHireArr);
    }

    if (pipelineTimes.length) {
      metrics.avgDaysInPipeline = mean(pipelineTimes);
    }

    const dailyApps = {}, weeklyApps = {}, monthlyApps = {};
    const dayOfWeekApps = {}, dayOfWeekConversions = {};

    workingData.forEach(d => {
      const dateApply = d.dateApplyDate;
      
      if (dateApply) {
        const dayKey = dateApply.toISOString().slice(0, 10);
        const weekKey = getWeekKey(dateApply);
        const monthKey = `${dateApply.getFullYear()}-${String(dateApply.getMonth() + 1).padStart(2, '0')}`;
        const dayOfWeek = getDayOfWeek(dateApply);
        
        dailyApps[dayKey] = (dailyApps[dayKey] || 0) + 1;
        weeklyApps[weekKey] = (weeklyApps[weekKey] || 0) + 1;
        monthlyApps[monthKey] = (monthlyApps[monthKey] || 0) + 1;
        dayOfWeekApps[dayOfWeek] = (dayOfWeekApps[dayOfWeek] || 0) + 1;
        
        if (d.jotFormFilledBool) {
          dayOfWeekConversions[dayOfWeek] = (dayOfWeekConversions[dayOfWeek] || 0) + 1;
        }
        
        if (!metrics.conversionsByWeek[weekKey]) {
          metrics.conversionsByWeek[weekKey] = { total: 0, converted: 0, rejected: 0 };
        }
        metrics.conversionsByWeek[weekKey].total++;
        if (d.jotFormFilledBool) metrics.conversionsByWeek[weekKey].converted++;
        if (d.rejectedBool) metrics.conversionsByWeek[weekKey].rejected++;
      }
    });

    metrics.applicationsPerDay = dailyApps;
    metrics.applicationsPerWeek = weeklyApps;
    metrics.applicationsPerMonth = monthlyApps;
    metrics.applicationsByDayOfWeek = dayOfWeekApps;
    metrics.conversionsByDayOfWeek = dayOfWeekConversions;

    const dailyCounts = Object.values(dailyApps);
    if (dailyCounts.length) {
      metrics.avgDailyApplications = mean(dailyCounts);
      const maxApps = Math.max(...dailyCounts);
      const minApps = Math.min(...dailyCounts);
      metrics.peakApplicationDay = Object.keys(dailyApps).find(k => dailyApps[k] === maxApps);
      metrics.lowApplicationDay = Object.keys(dailyApps).find(k => dailyApps[k] === minApps);
    }

    if (Object.keys(dayOfWeekApps).length) {
      const sortedDays = Object.entries(dayOfWeekApps).sort((a, b) => b[1] - a[1]);
      metrics.bestDayForApplications = sortedDays[0][0];
    }

    if (Object.keys(dayOfWeekConversions).length) {
      const convRateByDay = {};
      Object.keys(dayOfWeekApps).forEach(day => {
        const apps = dayOfWeekApps[day] || 0;
        const convs = dayOfWeekConversions[day] || 0;
        convRateByDay[day] = apps > 0 ? (convs / apps) * 100 : 0;
      });
      const sortedByRate = Object.entries(convRateByDay).sort((a, b) => b[1] - a[1]);
      if (sortedByRate.length) metrics.bestDayForConversions = sortedByRate[0][0];
    }

    const platforms = {};
    workingData.forEach(d => {
      const platform = d.platform || 'Unknown';
      if (!platforms[platform]) {
        platforms[platform] = { total: 0, converted: 0, rejected: 0, notConnected: 0, msgNotReceived: 0, exps: [], responseTimes: [] };
      }
      platforms[platform].total++;
      if (d.jotFormFilledBool) platforms[platform].converted++;
      if (d.rejectedBool) platforms[platform].rejected++;
      if (d.notConnectedBool) platforms[platform].notConnected++;
      if (d.messageNotReceived) platforms[platform].msgNotReceived++;
      if (d.exp) platforms[platform].exps.push(d.exp);
      
      if (d.daysToFirstContact !== null && d.daysToFirstContact >= 0) {
        platforms[platform].responseTimes.push(d.daysToFirstContact);
      }
    });

    Object.keys(platforms).forEach(p => {
      const pd = platforms[p];
      const convRate = pd.total ? (pd.converted / pd.total) * 100 : 0;
      const rejRate = pd.total ? (pd.rejected / pd.total) * 100 : 0;
      const avgExp = pd.exps.length ? mean(pd.exps) : 0;
      const avgRT = pd.responseTimes.length ? mean(pd.responseTimes) : 0;
      
      metrics.candidatesPerPlatform[p] = pd.total;
      metrics.platformPercent[p] = ((pd.total / workingData.length) * 100).toFixed(2);
      metrics.conversionRatePerPlatform[p] = convRate.toFixed(2);
      metrics.rejectionRatePerPlatform[p] = rejRate.toFixed(2);
      metrics.notConnectedPerPlatform[p] = pd.total ? ((pd.notConnected / pd.total) * 100).toFixed(2) : 0;
      metrics.msgNotReceivedPerPlatform[p] = pd.total ? ((pd.msgNotReceived / pd.total) * 100).toFixed(2) : 0;
      metrics.avgExpPerPlatform[p] = avgExp.toFixed(2);
      metrics.responseTimePerPlatform[p] = avgRT.toFixed(1);
      metrics.platformEfficiency[p] = (convRate - rejRate).toFixed(2);
      metrics.platformQualityScore[p] = ((convRate * avgExp) / 100).toFixed(2);
      metrics.platformROI[p] = rejRate > 0 ? (convRate / rejRate).toFixed(2) : convRate.toFixed(2);
      
      const conversionTimes = workingData.filter(d => (d.platform || 'Unknown') === p && d.jotFormFilledBool && d.daysToJotForm !== null && d.daysToJotForm >= 0)
        .map(d => d.daysToJotForm);
      metrics.platformVelocity[p] = conversionTimes.length ? mean(conversionTimes).toFixed(1) : "N/A";
    });

    const platformsByEff = Object.entries(metrics.platformEfficiency).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
    if (platformsByEff.length) {
      metrics.topPlatform = platformsByEff[0][0];
      metrics.bottomPlatform = platformsByEff[platformsByEff.length - 1][0];
    }

    const recruiters = {};
    workingData.forEach(d => {
      const recruiter = d.assignTo || 'Unassigned';
      if (!recruiters[recruiter]) {
        recruiters[recruiter] = { total: 0, converted: 0, rejected: 0, exps: [], responseTimes: [], weeklyConv: {} };
      }
      recruiters[recruiter].total++;
      if (d.jotFormFilledBool) recruiters[recruiter].converted++;
      if (d.rejectedBool) recruiters[recruiter].rejected++;
      if (d.exp) recruiters[recruiter].exps.push(d.exp);
      
      if (d.daysToFirstContact !== null && d.daysToFirstContact >= 0) {
        recruiters[recruiter].responseTimes.push(d.daysToFirstContact);
      }
      
      const dateApply = d.dateApplyDate;
      if (dateApply) {
        const week = getWeekKey(dateApply);
        if (!recruiters[recruiter].weeklyConv[week]) recruiters[recruiter].weeklyConv[week] = { total: 0, converted: 0 };
        recruiters[recruiter].weeklyConv[week].total++;
        if (d.jotFormFilledBool) recruiters[recruiter].weeklyConv[week].converted++;
      }
    });

    Object.keys(recruiters).forEach(r => {
      const rd = recruiters[r];
      const convRate = rd.total ? (rd.converted / rd.total) * 100 : 0;
      const rejRate = rd.total ? (rd.rejected / rd.total) * 100 : 0;
      const avgExp = rd.exps.length ? mean(rd.exps) : 0;
      const avgRT = rd.responseTimes.length ? mean(rd.responseTimes) : 0;
      const responseScore = avgRT > 0 ? Math.max(0, 100 - avgRT * 10) : 0;
      
      metrics.candidatesPerRecruiter[r] = rd.total;
      metrics.conversionPerRecruiter[r] = convRate.toFixed(2);
      metrics.rejectionPerRecruiter[r] = rejRate.toFixed(2);
      metrics.avgExpPerRecruiter[r] = avgExp.toFixed(2);
      metrics.responseTimePerRecruiter[r] = avgRT.toFixed(1);
      metrics.recruiterEfficiency[r] = (convRate - rejRate).toFixed(2);
      metrics.recruiterQualityScore[r] = ((convRate * 0.4) + ((convRate - rejRate) * 0.3) + (responseScore * 0.3)).toFixed(2);
      
      const conversionTimes = workingData.filter(d => (d.assignTo || 'Unassigned') === r && d.jotFormFilledBool && d.daysToJotForm !== null && d.daysToJotForm >= 0)
        .map(d => d.daysToJotForm);
      metrics.recruiterVelocity[r] = conversionTimes.length ? mean(conversionTimes).toFixed(1) : "N/A";
      
      const weeklyRates = Object.values(rd.weeklyConv)
        .map(w => w.total > 0 ? (w.converted / w.total) * 100 : 0).filter(rate => rate > 0);
      metrics.recruiterConsistency[r] = weeklyRates.length > 1 ? cv(weeklyRates).toFixed(2) : "N/A";
    });

    const recruitersByQuality = Object.entries(metrics.recruiterQualityScore).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
    if (recruitersByQuality.length) {
      metrics.topRecruiter = recruitersByQuality[0][0];
      metrics.bottomRecruiter = recruitersByQuality[recruitersByQuality.length - 1][0];
    }

    const workloads = Object.values(metrics.candidatesPerRecruiter);
    metrics.recruiterWorkload = {
      avg: workloads.length ? mean(workloads).toFixed(1) : 0,
      min: workloads.length ? Math.min(...workloads) : 0,
      max: workloads.length ? Math.max(...workloads) : 0,
      stdDev: workloads.length ? stddev(workloads).toFixed(2) : 0,
      balanced: workloads.length && stddev(workloads) < mean(workloads) * 0.3
    };

    metrics.funnelStages.applied = workingData.length;
    metrics.funnelStages.contacted = workingData.filter(d => d.messageSentBool || d.firstCallBool).length;
    metrics.funnelStages.responded = workingData.filter(d => d.dateDataGivenDate).length;
    metrics.funnelStages.interested = metrics.willSubmitJotFormCount;
    metrics.funnelStages.converted = metrics.jotFormFilledCount;

    const allPlatforms = [...new Set(workingData.map(d => d.platform || 'Unknown'))];
    allPlatforms.forEach(platform => {
      const platformData = workingData.filter(d => (d.platform || 'Unknown') === platform);
      metrics.funnelByPlatform[platform] = {
        applied: platformData.length,
        contacted: platformData.filter(d => d.messageSentBool || d.firstCallBool).length,
        responded: platformData.filter(d => d.dateDataGivenDate).length,
        interested: platformData.filter(d => d.willSubmitJotForm).length,
        converted: platformData.filter(d => d.jotFormFilledBool).length
      };
    });

    const allRecruiters = [...new Set(workingData.map(d => d.assignTo || 'Unassigned'))];
    allRecruiters.forEach(recruiter => {
      const recruiterData = workingData.filter(d => (d.assignTo || 'Unassigned') === recruiter);
      metrics.funnelByRecruiter[recruiter] = {
        applied: recruiterData.length,
        contacted: recruiterData.filter(d => d.messageSentBool || d.firstCallBool).length,
        responded: recruiterData.filter(d => d.dateDataGivenDate).length,
        interested: recruiterData.filter(d => d.willSubmitJotForm).length,
        converted: recruiterData.filter(d => d.jotFormFilledBool).length
      };
    });

    const stages = Object.keys(metrics.funnelStages);
    for (let i = 1; i < stages.length; i++) {
      const prevStage = stages[i - 1];
      const currStage = stages[i];
      const prevCount = metrics.funnelStages[prevStage];
      const currCount = metrics.funnelStages[currStage];
      
      metrics.stageConversionRates[`${prevStage}_to_${currStage}`] = prevCount > 0 ? ((currCount / prevCount) * 100).toFixed(2) : 0;
      metrics.dropoffRates[`${prevStage}_to_${currStage}`] = prevCount > 0 ? (((prevCount - currCount) / prevCount) * 100).toFixed(2) : 0;
    }

    const contacted = metrics.funnelStages.contacted;
    const responded = metrics.funnelStages.responded;
    metrics.communicationSuccessRate = contacted > 0 ? ((responded / contacted) * 100).toFixed(2) : 0;
    metrics.responseRate = contacted > 0 ? ((responded / contacted) * 100).toFixed(2) : 0;
    
    const commAttempts = workingData.map(d => {
      let attempts = 0;
      if (d.messageSentBool) attempts++;
      if (d.firstCallBool) attempts++;
      if (d.reminderMsg1) attempts++;
      return attempts;
    }).filter(a => a > 0);
    metrics.avgCommunicationAttempts = commAttempts.length ? mean(commAttempts).toFixed(2) : 0;
    
    metrics.messageSuccess = metrics.messageSentCount > 0 ? (((metrics.messageSentCount - metrics.messageNotReceivedCount) / metrics.messageSentCount) * 100).toFixed(2) : 0;
    metrics.callSuccess = contacted > 0 ? ((metrics.firstCallCount / contacted) * 100).toFixed(2) : 0;
    
    const overallConvRate = workingData.length > 0 ? (metrics.jotFormFilledCount / workingData.length) * 100 : 0;
    metrics.engagementScore = ((parseFloat(metrics.responseRate) + overallConvRate) / 2).toFixed(2);

    const joined = workingData.filter(d => d.joinedBool || d.workedFor90Days);
    const joinedCount = joined.length || 1;
    
    const totalCalls = workingData.reduce((sum, d) => sum + d.totalCalls, 0);
    const totalMessages = workingData.reduce((sum, d) => sum + d.totalMessages, 0);
    const totalTouchpoints = workingData.reduce((sum, d) => sum + d.totalTouchpoints, 0);
    
    metrics.callsPerHire = (totalCalls / joinedCount).toFixed(2);
    metrics.messagesPerHire = (totalMessages / joinedCount).toFixed(2);
    metrics.touchpointsPerHire = (totalTouchpoints / joinedCount).toFixed(2);
    metrics.conversionRate = ((metrics.jotFormFilledCount / workingData.length) * 100).toFixed(2);
    metrics.rejectionRate = ((metrics.rejectedCount / workingData.length) * 100).toFixed(2);
    metrics.costPerHire = (totalTouchpoints * 75 / joinedCount).toFixed(2);
    metrics.totalRecruitmentCost = (totalTouchpoints * 75).toFixed(0);
    metrics.pipelineVelocity = workingData.length > 0 ? (workingData.length / (metrics.avgDaysInPipeline || 1)).toFixed(2) : 0;
    metrics.avgCallsPerCandidate = (totalCalls / workingData.length).toFixed(2);
    metrics.avgMessagesPerCandidate = (totalMessages / workingData.length).toFixed(2);
    metrics.avgTouchpointsPerCandidate = (totalTouchpoints / workingData.length).toFixed(2);
    metrics.activeInPipeline = workingData.filter(d => !d.currentStage.includes('Rejected') && !d.currentStage.includes('Joined') && !d.currentStage.includes('Worked 90')).length;
    
    metrics.overallEfficiency = ((metrics.jotFormFilledCount / workingData.length) * 100).toFixed(2);
    metrics.resourceUtilization = metrics.totalRecruiters > 0 ? (workingData.length / metrics.totalRecruiters).toFixed(2) : 0;
    
    const convertedExps = workingData.filter(d => d.jotFormFilledBool).map(d => d.exp).filter(e => e > 0);
    metrics.qualityOfHire = convertedExps.length ? mean(convertedExps).toFixed(2) : 0;

    ['0-1', '1-3', '3-5', '5+'].forEach(level => {
      let count = 0, converted = 0;
      workingData.forEach(d => {
        let inRange = false;
        if (level === '0-1' && d.exp < 1) inRange = true;
        else if (level === '1-3' && d.exp >= 1 && d.exp < 3) inRange = true;
        else if (level === '3-5' && d.exp >= 3 && d.exp < 5) inRange = true;
        else if (level === '5+' && d.exp >= 5) inRange = true;
        
        if (inRange) {
          count++;
          if (d.jotFormFilledBool) converted++;
        }
      });
      metrics.conversionPredictors[`exp_${level}`] = count > 0 ? ((converted / count) * 100).toFixed(2) : 0;
    });

    metrics.rejectionPredictors = {
      notConnectedRate: contacted > 0 ? ((metrics.notConnectedCount / contacted) * 100).toFixed(2) : 0,
      messageNotReceivedRate: metrics.messageSentCount > 0 ? ((metrics.messageNotReceivedCount / metrics.messageSentCount) * 100).toFixed(2) : 0,
      overallRejectionRate: ((metrics.rejectedCount / workingData.length) * 100).toFixed(2)
    };

    const riskFactors = [
      parseFloat(metrics.rejectionPredictors.overallRejectionRate),
      100 - parseFloat(metrics.responseRate),
      parseFloat(metrics.rejectionPredictors.notConnectedRate)
    ];
    metrics.riskScore = mean(riskFactors).toFixed(2);
    metrics.opportunityScore = (100 - parseFloat(metrics.riskScore)).toFixed(2);

    const convRate = parseFloat(metrics.conversionRate);
    const respRate = parseFloat(metrics.responseRate);
    const effScore = parseFloat(mean(Object.values(metrics.recruiterEfficiency).map(e => parseFloat(e) || 0)));
    metrics.recruitmentHealthScore = ((convRate + respRate + effScore) / 3).toFixed(2);
    metrics.talentPoolQuality = (metrics.avgExp * convRate / 100).toFixed(2);
    metrics.processEffectiveness = (convRate - parseFloat(metrics.rejectionRate)).toFixed(2);

    const weeklyData = Object.entries(weeklyApps).sort((a, b) => a[0].localeCompare(b[0]));
    if (weeklyData.length >= 8) {
      const lastFour = weeklyData.slice(-4).map(w => w[1]);
      const prevFour = weeklyData.slice(-8, -4).map(w => w[1]);
      const lastAvg = mean(lastFour);
      const prevAvg = mean(prevFour);
      
      if (lastAvg > prevAvg * 1.1) metrics.trendDirection = "Increasing";
      else if (lastAvg < prevAvg * 0.9) metrics.trendDirection = "Decreasing";
      else metrics.trendDirection = "Stable";
    }

    const recentWeeklyAvg = weeklyData.length > 0 ? mean(weeklyData.slice(-4).map(w => w[1])) : 0;
    metrics.expectedConversionsNextWeek = (recentWeeklyAvg * convRate / 100).toFixed(1);

    if (weeklyData.length) {
      const avgWeeklyApps = mean(weeklyData.map(w => w[1]));
      weeklyData.forEach(([week, count]) => {
        metrics.seasonalityIndex[week] = avgWeeklyApps > 0 ? ((count / avgWeeklyApps) * 100).toFixed(2) : 100;
      });
    }

    metrics.internalBenchmarks = {
      avgConversionRate: convRate,
      targetConversionRate: 25,
      gap: (25 - convRate).toFixed(2),
      avgResponseTime: metrics.avgDaysToFirstContact,
      targetResponseTime: 2,
      responseTimeGap: (parseFloat(metrics.avgDaysToFirstContact) - 2).toFixed(1)
    };

    metrics.performanceGaps = {
      conversionGap: metrics.internalBenchmarks.gap,
      responseTimeGap: metrics.internalBenchmarks.responseTimeGap,
      engagementGap: (75 - parseFloat(metrics.engagementScore)).toFixed(2)
    };

    metrics.positionDiversity = metrics.uniquePositions;
    metrics.platformDiversity = metrics.uniquePlatforms;
    metrics.experienceDiversity = new Set(exps.map(e => Math.floor(e))).size;

    metrics.rejectionReasons = {
      notConnected: metrics.notConnectedCount,
      messageNotReceived: metrics.messageNotReceivedCount,
      explicitRejection: metrics.rejectedCount,
      dropoffRate: workingData.length - (metrics.jotFormFilledCount + metrics.rejectedCount + metrics.willSubmitJotFormCount)
    };

    metrics.communicationChannelEffectiveness = {
      messageSuccess: metrics.messageSuccess,
      callSuccess: metrics.callSuccess,
      followUpRate: contacted > 0 ? ((workingData.filter(d => d.reminderMsg1).length / contacted) * 100).toFixed(2) : 0
    };

    const stageDropoffs = [];
    for (let i = 1; i < stages.length; i++) {
      const prevStage = stages[i - 1];
      const currStage = stages[i];
      const dropoff = metrics.funnelStages[prevStage] - metrics.funnelStages[currStage];
      const dropoffPercent = metrics.dropoffRates[`${prevStage}_to_${currStage}`];
      stageDropoffs.push({ stage: `${prevStage} to ${currStage}`, dropoff, dropoffPercent });
    }
    const maxDropoff = stageDropoffs.reduce((max, stage) => 
      parseFloat(stage.dropoffPercent) > parseFloat(max.dropoffPercent) ? stage : max
    , stageDropoffs[0] || { stage: 'None', dropoffPercent: 0 });
    metrics.bottleneckIdentification = {
      biggestBottleneck: maxDropoff.stage,
      dropoffPercent: maxDropoff.dropoffPercent,
      allDropoffs: stageDropoffs
    };

    metrics.capacityAnalysis = {
      candidatesPerRecruiter: metrics.resourceUtilization,
      avgCandidatesPerDay: metrics.avgDailyApplications,
      peakCapacity: dailyCounts.length ? Math.max(...dailyCounts) : 0,
      utilizationRate: dailyCounts.length && Math.max(...dailyCounts) > 0 
        ? ((parseFloat(metrics.avgDailyApplications) / Math.max(...dailyCounts)) * 100).toFixed(2) 
        : 0
    };

    metrics.dataCompleteness = 85;
    metrics.dataQualityScore = 85;
    metrics.dataQualityIndex = 85;

    const maturityFactors = [
      metrics.dataCompleteness > 80 ? 1 : 0,
      parseFloat(metrics.overallEfficiency) > 15 ? 1 : 0,
      parseFloat(metrics.responseRate) > 50 ? 1 : 0,
      metrics.totalRecruiters > 3 ? 1 : 0,
      parseFloat(metrics.avgDaysToFirstContact) < 3 ? 1 : 0
    ];
    metrics.processMaturityLevel = maturityFactors.reduce((a, b) => a + b, 0);

    const alignmentScore = [
      parseFloat(metrics.internalBenchmarks.gap) < 5 ? 20 : 0,
      parseFloat(metrics.responseRate) > 60 ? 20 : 0,
      parseFloat(metrics.engagementScore) > 60 ? 20 : 0,
      parseFloat(metrics.processEffectiveness) > 10 ? 20 : 0,
      parseFloat(metrics.opportunityScore) > 60 ? 20 : 0
    ].reduce((a, b) => a + b, 0);
    metrics.strategicAlignment = alignmentScore;

    metrics.overallRecruitmentScore = parseFloat(metrics.recruitmentHealthScore);
    metrics.candidateSourceMix = metrics.platformPercent;

    return metrics;
  }, [filteredData]);

  const filterOptions = useMemo(() => ({
    platforms: ['all', ...new Set(data.map(d => d.platform).filter(Boolean))],
    assignees: ['all', ...new Set(data.map(d => d.assignTo).filter(Boolean))],
    stages: ['all', ...new Set(data.map(d => d.currentStage).filter(Boolean))],
    experiences: ['all', 'Fresher', '1-3 years', '3-5 years', '5+ years'],
    positions: ['all', ...new Set(data.map(d => d.position).filter(Boolean))]
  }), [data]);

  const getActionSuggestions = (stage, stageData, analytics) => {
    const suggestions = [];
    const convRate = stageData.conversionRate || 0;
    const dropoff = stageData.dropoffRate || 0;

    switch(stage) {
      case 'applied':
        if (analytics.uniquePlatforms < 3) {
          suggestions.push({ type: 'warning', text: 'Expand sourcing channels - Currently using only ' + analytics.uniquePlatforms + ' platforms' });
        }
        if (analytics.avgDailyApplications < 5) {
          suggestions.push({ type: 'critical', text: 'Low application volume - Average ' + analytics.avgDailyApplications.toFixed(1) + ' per day. Increase marketing efforts.' });
        }
        suggestions.push({ type: 'info', text: 'Review job descriptions for clarity and appeal' });
        suggestions.push({ type: 'success', text: 'Monitor best performing platforms: ' + (analytics.topPlatform || 'N/A') });
        break;

      case 'contacted':
        if (convRate < 80) {
          suggestions.push({ type: 'critical', text: 'Contact rate is ' + convRate.toFixed(1) + '% - Should be >80%. Review contact information quality.' });
        }
        if (parseFloat(analytics.avgDaysToFirstContact) > 2) {
          suggestions.push({ type: 'warning', text: 'Slow response time: ' + analytics.avgDaysToFirstContact.toFixed(1) + ' days. Aim for <2 days.' });
        }
        suggestions.push({ type: 'info', text: 'Use multi-channel approach: calls, emails, and messages' });
        suggestions.push({ type: 'success', text: 'Follow up within 24-48 hours of application' });
        if (parseFloat(analytics.messageSuccess) < 70) {
          suggestions.push({ type: 'warning', text: 'Message success rate is ' + analytics.messageSuccess + '%. Improve message templates.' });
        }
        break;

      case 'responded':
        if (convRate < 60) {
          suggestions.push({ type: 'critical', text: 'Response rate is ' + convRate.toFixed(1) + '% - Should be >60%. Review communication quality.' });
        }
        if (parseFloat(analytics.avgCommunicationAttempts) < 2) {
          suggestions.push({ type: 'warning', text: 'Increase follow-up attempts - Currently ' + analytics.avgCommunicationAttempts + ' average attempts' });
        }
        suggestions.push({ type: 'info', text: 'Personalize outreach messages based on candidate background' });
        suggestions.push({ type: 'success', text: 'Send reminder messages at 2, 4, and 15 day intervals' });
        suggestions.push({ type: 'info', text: 'Best contact day: ' + (analytics.bestDayForApplications || 'Analyze more data') });
        break;

      case 'interested':
        if (convRate < 70) {
          suggestions.push({ type: 'critical', text: 'Interest conversion is ' + convRate.toFixed(1) + '% - Should be >70%. Improve value proposition.' });
        }
        suggestions.push({ type: 'info', text: 'Clearly communicate job benefits and growth opportunities' });
        suggestions.push({ type: 'success', text: 'Address candidate concerns promptly' });
        suggestions.push({ type: 'warning', text: 'Simplify form submission process - reduce friction' });
        if (analytics.rejectionReasons.dropoffRate > 20) {
          suggestions.push({ type: 'critical', text: 'High dropoff: ' + analytics.rejectionReasons.dropoffRate + ' candidates. Investigate barriers.' });
        }
        break;

      case 'converted':
        if (parseFloat(analytics.conversionRate) < 15) {
          suggestions.push({ type: 'critical', text: 'Overall conversion is ' + analytics.conversionRate + '% - Should be >15%. Review entire funnel.' });
        }
        if (parseFloat(analytics.timeToFill) > 30) {
          suggestions.push({ type: 'warning', text: 'Time to fill is ' + analytics.timeToFill.toFixed(1) + ' days. Optimize process speed.' });
        }
        suggestions.push({ type: 'success', text: 'Quality of hire (avg exp): ' + analytics.qualityOfHire + ' years' });
        suggestions.push({ type: 'info', text: 'Best converting experience level: Check conversion predictors' });
        if (parseFloat(analytics.processEffectiveness) < 10) {
          suggestions.push({ type: 'warning', text: 'Process effectiveness is low. Focus on reducing rejections.' });
        }
        suggestions.push({ type: 'info', text: 'Maintain engagement post-conversion with regular updates' });
        break;
    }

    if (dropoff > 50) {
      suggestions.push({ type: 'critical', text: 'CRITICAL: ' + dropoff.toFixed(1) + '% dropoff to next stage. Immediate action required!' });
    } else if (dropoff > 30) {
      suggestions.push({ type: 'warning', text: 'High dropoff: ' + dropoff.toFixed(1) + '%. Review stage transition process.' });
    }

    return suggestions;
  };

  const renderEnhancedFunnel = () => {
    const funnelData = Object.entries(analytics.funnelStages).map(([stage, count], idx) => {
      const prevCount = idx > 0 ? Object.values(analytics.funnelStages)[idx - 1] : count;
      const conversionRate = prevCount > 0 ? (count / prevCount) * 100 : 100;
      const dropoffRate = prevCount > 0 ? ((prevCount - count) / prevCount) * 100 : 0;
      
      return {
        stage,
        count,
        conversionRate,
        dropoffRate,
        percentage: analytics.totalCandidates > 0 ? (count / analytics.totalCandidates) * 100 : 0
      };
    });

    return (
      <div className="space-y-3">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-900">Recruitment Funnel Analysis</h3>
          
          <div className="space-y-4">
            {funnelData.map((item, idx) => (
              <div key={item.stage} className="relative">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  {/* Funnel Stage */}
                  <div 
                    className="flex-1 relative"
                    onMouseEnter={() => setHoveredStage(item.stage)}
                    onMouseLeave={() => setHoveredStage(null)}
                    onClick={() => setHoveredStage(hoveredStage === item.stage ? null : item.stage)}
                  >
                    {/* Stage Bar */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer w-full md:w-auto"
                         style={{
                           minWidth: '100%',
                           maxWidth: '100%'
                         }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-xs md:text-sm uppercase">{item.stage}</h4>
                          <p className="text-xl md:text-2xl font-bold">{item.count}</p>
                        </div>
                        <div className="text-right">
                          {idx > 0 && (
                            <>
                              <p className="text-xs opacity-90">Conversion</p>
                              <p className="text-base md:text-lg font-bold">{item.conversionRate.toFixed(1)}%</p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {idx > 0 && (
                        <div className="mt-2 text-xs opacity-75">
                          Dropoff: {item.dropoffRate.toFixed(1)}% ({funnelData[idx - 1].count - item.count} candidates)
                        </div>
                      )}
                    </div>

                    {/* Hover Details - Platform & Recruiter Breakdown */}
                    {hoveredStage === item.stage && (
                      <div className="mt-2 md:absolute md:left-0 md:top-full md:mt-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl p-3 md:p-4 z-50 w-full md:min-w-[500px]">
                        <h5 className="font-semibold mb-3 text-gray-800 text-sm md:text-base">Stage Breakdown</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Platform Breakdown */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">By Platform</p>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {Object.entries(analytics.funnelByPlatform)
                                .map(([platform, stages]) => ({
                                  platform,
                                  count: stages[item.stage] || 0
                                }))
                                .filter(p => p.count > 0)
                                .sort((a, b) => b.count - a.count)
                                .map(({ platform, count }) => (
                                  <div key={platform} className="flex justify-between text-xs bg-gray-50 p-1 rounded">
                                    <span className="font-medium truncate">{platform}</span>
                                    <span className="text-blue-600 font-bold ml-2">{count}</span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Recruiter Breakdown */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">By Recruiter</p>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {Object.entries(analytics.funnelByRecruiter)
                                .map(([recruiter, stages]) => ({
                                  recruiter,
                                  count: stages[item.stage] || 0
                                }))
                                .filter(r => r.count > 0)
                                .sort((a, b) => b.count - a.count)
                                .map(({ recruiter, count }) => (
                                  <div key={recruiter} className="flex justify-between text-xs bg-gray-50 p-1 rounded">
                                    <span className="font-medium truncate">{recruiter}</span>
                                    <span className="text-green-600 font-bold ml-2">{count}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            <strong>Tip:</strong> Click "View Actions" to see improvement suggestions for this stage
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Suggestions Button */}
                  <div className="flex items-center">
                    <button
                      onClick={() => setSelectedStageForActions(selectedStageForActions === item.stage ? null : item.stage)}
                      className={`w-full md:w-auto px-3 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                        selectedStageForActions === item.stage
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {selectedStageForActions === item.stage ? 'Hide Actions' : 'View Actions'}
                    </button>
                  </div>
                </div>

                {/* Action Suggestions Panel */}
                {selectedStageForActions === item.stage && (
                  <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-lg p-3 md:p-4 shadow-inner">
                    <h5 className="font-semibold text-amber-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                      <Target className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Action Recommendations for {item.stage.toUpperCase()}</span>
                    </h5>
                    
                    <div className="space-y-2">
                      {getActionSuggestions(item.stage, item, analytics).map((suggestion, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-start gap-2 p-2 rounded text-xs ${
                            suggestion.type === 'critical' ? 'bg-red-100 border-l-2 border-red-500' :
                            suggestion.type === 'warning' ? 'bg-yellow-100 border-l-2 border-yellow-500' :
                            suggestion.type === 'success' ? 'bg-green-100 border-l-2 border-green-500' :
                            'bg-blue-100 border-l-2 border-blue-500'
                          }`}
                        >
                          {suggestion.type === 'critical' && <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />}
                          {suggestion.type === 'warning' && <TrendingDown className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />}
                          {suggestion.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />}
                          {suggestion.type === 'info' && <Brain className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />}
                          <span className={
                            suggestion.type === 'critical' ? 'text-red-800 font-medium' :
                            suggestion.type === 'warning' ? 'text-yellow-800' :
                            suggestion.type === 'success' ? 'text-green-800' :
                            'text-blue-800'
                          }>{suggestion.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-3 pt-3 border-t border-amber-200 grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white bg-opacity-50 p-2 rounded">
                        <span className="text-gray-600 block text-xs">Stage Count:</span>
                        <p className="font-bold text-base md:text-lg">{item.count}</p>
                      </div>
                      {idx > 0 && (
                        <>
                          <div className="bg-white bg-opacity-50 p-2 rounded">
                            <span className="text-gray-600 block text-xs">Conversion:</span>
                            <p className="font-bold text-base md:text-lg text-green-600">{item.conversionRate.toFixed(1)}%</p>
                          </div>
                          <div className="bg-white bg-opacity-50 p-2 rounded">
                            <span className="text-gray-600 block text-xs">Dropoff:</span>
                            <p className="font-bold text-base md:text-lg text-red-600">{item.dropoffRate.toFixed(1)}%</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Arrow to next stage */}
                {idx < funnelData.length - 1 && (
                  <div className="flex justify-center my-2">
                    <TrendingDown className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall Funnel Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold mb-3 text-sm md:text-base">Overall Funnel Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 text-xs">
              <div className="bg-blue-50 p-2 md:p-3 rounded">
                <p className="text-gray-600 text-xs">Overall Conversion</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{analytics.conversionRate}%</p>
              </div>
              <div className="bg-green-50 p-2 md:p-3 rounded">
                <p className="text-gray-600 text-xs">Avg Time to Fill</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{analytics.timeToFill.toFixed(1)}d</p>
              </div>
              <div className="bg-purple-50 p-2 md:p-3 rounded">
                <p className="text-gray-600 text-xs">Pipeline Velocity</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">{analytics.pipelineVelocity}</p>
              </div>
              <div className="bg-amber-50 p-2 md:p-3 rounded">
                <p className="text-gray-600 text-xs">Active Pipeline</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">{analytics.activeInPipeline}</p>
              </div>
              <div className="bg-red-50 p-2 md:p-3 rounded col-span-2 md:col-span-1">
                <p className="text-gray-600 text-xs">Biggest Bottleneck</p>
                <p className="text-xs md:text-sm font-bold text-red-600 truncate" title={analytics.bottleneckIdentification.biggestBottleneck}>
                  {analytics.bottleneckIdentification.biggestBottleneck}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{analytics.totalCandidates}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <p className="text-xs text-gray-500">Converted</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">{analytics.jotFormFilledCount}</p>
          <p className="text-xs text-gray-500">{analytics.conversionRate}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-xl md:text-2xl font-bold text-blue-600">{analytics.activeInPipeline}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <p className="text-xs text-gray-500">Rejected</p>
          <p className="text-xl md:text-2xl font-bold text-red-600">{analytics.rejectedCount}</p>
          <p className="text-xs text-gray-500">{analytics.rejectionRate}%</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm col-span-2 md:col-span-1">
          <p className="text-xs text-gray-500">Health Score</p>
          <p className="text-xl md:text-2xl font-bold text-purple-600">{analytics.recruitmentHealthScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-900">Funnel</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={Object.entries(analytics.funnelStages).map(([k,v]) => ({name:k,value:v}))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize:10}} />
              <YAxis tick={{fontSize:10}} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-900">Platform Performance</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
            {Object.entries(analytics.candidatesPerPlatform).slice(0, 8).map(([platform, count]) => (
              <div key={platform} className="flex justify-between">
                <span className="truncate text-gray-700">{platform}</span>
                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">{count} ({analytics.conversionRatePerPlatform[platform]}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-3">
      {/* Experience */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Experience Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          <div><span className="text-gray-600">Avg:</span> <strong className="text-gray-900">{analytics.avgExp.toFixed(1)}y</strong></div>
          <div><span className="text-gray-600">Median:</span> <strong className="text-gray-900">{analytics.medianExp.toFixed(1)}y</strong></div>
          <div><span className="text-gray-600">Mode:</span> <strong className="text-gray-900">{analytics.modeExp}y</strong></div>
          <div><span className="text-gray-600">StdDev:</span> <strong className="text-gray-900">{analytics.expStdDev.toFixed(2)}</strong></div>
          <div><span className="text-gray-600">75th:</span> <strong className="text-gray-900">{analytics.exp75thPercentile.toFixed(1)}y</strong></div>
          <div><span className="text-gray-600">90th:</span> <strong className="text-gray-900">{analytics.exp90thPercentile.toFixed(1)}y</strong></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
          <div className="p-2 bg-blue-50 rounded"><span className="text-gray-700">Freshers:</span> <strong className="text-gray-900">{analytics.countFreshers}</strong></div>
          <div className="p-2 bg-green-50 rounded"><span className="text-gray-700">Mid:</span> <strong className="text-gray-900">{analytics.countMidLevel}</strong></div>
          <div className="p-2 bg-purple-50 rounded"><span className="text-gray-700">Senior:</span> <strong className="text-gray-900">{analytics.countSenior}</strong></div>
        </div>
      </div>

      {/* Time Metrics */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Time Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div><span className="text-gray-600">Avg Response:</span> <strong className="text-gray-900">{analytics.avgDaysToFirstContact.toFixed(1)}d</strong></div>
          <div><span className="text-gray-600">Median:</span> <strong className="text-gray-900">{analytics.medianResponseTime.toFixed(1)}d</strong></div>
          <div><span className="text-gray-600">Fastest:</span> <strong className="text-green-600">{analytics.fastestResponse}d</strong></div>
          <div><span className="text-gray-600">Slowest:</span> <strong className="text-red-600">{analytics.slowestResponse}d</strong></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs">
          <div><span className="text-gray-600">Avg Pipeline:</span> <strong className="text-gray-900">{analytics.avgDaysInPipeline.toFixed(1)}d</strong></div>
          <div><span className="text-gray-600">Avg to Form:</span> <strong className="text-gray-900">{analytics.avgDaysToJotForm.toFixed(1)}d</strong></div>
          <div><span className="text-gray-600">Time to Fill:</span> <strong className="text-gray-900">{analytics.timeToFill.toFixed(1)}d</strong></div>
          <div><span className="text-gray-600">Avg to Hire:</span> <strong className="text-gray-900">{analytics.avgDaysToHire.toFixed(1)}d</strong></div>
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Efficiency Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div><span className="text-gray-600">Calls/Hire:</span> <strong className="text-gray-900">{analytics.callsPerHire}</strong></div>
          <div><span className="text-gray-600">Msgs/Hire:</span> <strong className="text-gray-900">{analytics.messagesPerHire}</strong></div>
          <div><span className="text-gray-600">Touch/Hire:</span> <strong className="text-gray-900">{analytics.touchpointsPerHire}</strong></div>
          <div><span className="text-gray-600">Cost/Hire:</span> <strong className="text-gray-900">₹{analytics.costPerHire}</strong></div>
          <div><span className="text-gray-600">Total Cost:</span> <strong className="text-gray-900">₹{analytics.totalRecruitmentCost}</strong></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
          <div><span className="text-gray-600">Avg Calls:</span> <strong className="text-gray-900">{analytics.avgCallsPerCandidate}</strong></div>
          <div><span className="text-gray-600">Avg Msgs:</span> <strong className="text-gray-900">{analytics.avgMessagesPerCandidate}</strong></div>
          <div><span className="text-gray-600">Avg Touch:</span> <strong className="text-gray-900">{analytics.avgTouchpointsPerCandidate}</strong></div>
        </div>
      </div>

      {/* Platform Deep Dive */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 md:p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Platform Analysis
          </h3>
          {analytics.topPlatform && (
            <span className="text-xs font-semibold bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
              Top: {analytics.topPlatform}
            </span>
          )}
        </div>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Platform</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Total</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Conv%</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Rej%</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Efficiency</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Quality</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(analytics.candidatesPerPlatform).slice(0, 10).map(([p, count], idx) => (
                <tr key={p} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-150 group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">{idx + 1}</span>
                      <span className="font-semibold text-gray-900">{p}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="font-bold text-gray-900">{count}</span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {analytics.conversionRatePerPlatform[p]}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      {analytics.rejectionRatePerPlatform[p]}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      parseFloat(analytics.platformEfficiency[p]) > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {parseFloat(analytics.platformEfficiency[p]) > 0 ? '+' : ''}{analytics.platformEfficiency[p]}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-semibold text-gray-900">{analytics.platformQualityScore[p]}</span>
                      <Star className={`h-3 w-3 ${parseFloat(analytics.platformQualityScore[p]) > 50 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="font-bold text-purple-700">{analytics.platformROI[p]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recruiter Performance */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 md:p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Recruiter Performance
          </h3>
          {analytics.topRecruiter && (
            <span className="text-xs font-semibold bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
              Top: {analytics.topRecruiter}
            </span>
          )}
        </div>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Rank</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Recruiter</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Total</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Conv%</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Efficiency</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Quality Score</th>
                <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(analytics.candidatesPerRecruiter)
                .sort((a,b) => parseFloat(analytics.recruiterQualityScore[b[0]]) - parseFloat(analytics.recruiterQualityScore[a[0]]))
                .slice(0, 10)
                .map(([r, count], idx) => (
                <tr key={r} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition-all duration-150 group">
                  <td className="py-3 px-4">
                    {idx === 0 ? (
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        <Award className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">{r}</span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="font-bold text-gray-900">{count}</span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {analytics.conversionPerRecruiter[r]}%
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      parseFloat(analytics.recruiterEfficiency[r]) > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {parseFloat(analytics.recruiterEfficiency[r]) > 0 ? '+' : ''}{analytics.recruiterEfficiency[r]}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(parseFloat(analytics.recruiterQualityScore[r]) || 0, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 w-12 text-right">{analytics.recruiterQualityScore[r]}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3" />
                      {analytics.responseTimePerRecruiter[r]}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Communication */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Communication Effectiveness</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-blue-50 rounded">
            <span className="text-gray-600 block">Msg Success:</span>
            <p className="text-base md:text-lg font-bold text-blue-600">{analytics.messageSuccess}%</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <span className="text-gray-600 block">Call Success:</span>
            <p className="text-base md:text-lg font-bold text-green-600">{analytics.callSuccess}%</p>
          </div>
          <div className="p-2 bg-purple-50 rounded">
            <span className="text-gray-600 block">Response Rate:</span>
            <p className="text-base md:text-lg font-bold text-purple-600">{analytics.responseRate}%</p>
          </div>
          <div className="p-2 bg-amber-50 rounded">
            <span className="text-gray-600 block">Avg Attempts:</span>
            <p className="text-base md:text-lg font-bold text-amber-600">{analytics.avgCommunicationAttempts}</p>
          </div>
        </div>
      </div>

      {/* Conversion Predictors */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Conversion by Experience</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {Object.entries(analytics.conversionPredictors).map(([key, value]) => (
            <div key={key} className="p-2 bg-gray-50 rounded">
              <span className="text-gray-600 block">{key.replace('exp_', '').replace('-', ' to ')}y:</span>
              <p className="text-base md:text-lg font-bold text-gray-900">{value}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk & Opportunity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-red-50 p-3 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-red-800 mb-1">Risk Score</h3>
          <p className="text-2xl font-bold text-red-600">{analytics.riskScore}</p>
          <div className="mt-2 space-y-1 text-xs">
            <div><span className="text-gray-700">Rejection:</span> <strong className="text-gray-900">{analytics.rejectionPredictors.overallRejectionRate}%</strong></div>
            <div><span className="text-gray-700">Not Connected:</span> <strong className="text-gray-900">{analytics.rejectionPredictors.notConnectedRate}%</strong></div>
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-green-800 mb-1">Opportunity</h3>
          <p className="text-2xl font-bold text-green-600">{analytics.opportunityScore}</p>
          <div className="mt-2 space-y-1 text-xs">
            <div><span className="text-gray-700">Quality:</span> <strong className="text-gray-900">{analytics.talentPoolQuality}</strong></div>
            <div><span className="text-gray-700">Effectiveness:</span> <strong className="text-gray-900">{analytics.processEffectiveness}</strong></div>
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-blue-800 mb-1">Health Score</h3>
          <p className="text-2xl font-bold text-blue-600">{analytics.recruitmentHealthScore}</p>
          <div className="mt-2 space-y-1 text-xs">
            <div><span className="text-gray-700">Engagement:</span> <strong className="text-gray-900">{analytics.engagementScore}</strong></div>
            <div><span className="text-gray-700">Overall:</span> <strong className="text-gray-900">{analytics.overallRecruitmentScore}</strong></div>
          </div>
        </div>
      </div>

      {/* Bottleneck */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Bottleneck Analysis</h3>
        <div className="p-2 bg-amber-50 rounded mb-2 text-xs">
          <p className="text-gray-900"><strong>Biggest Bottleneck:</strong> {analytics.bottleneckIdentification.biggestBottleneck}</p>
          <p className="text-gray-900"><strong>Dropoff:</strong> {analytics.bottleneckIdentification.dropoffPercent}%</p>
        </div>
        <div className="space-y-1 text-xs">
          {analytics.bottleneckIdentification.allDropoffs?.map((stage, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 truncate">{stage.stage}</span>
                <span className="font-semibold text-gray-900 ml-2 flex-shrink-0">{stage.dropoffPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-1">
                <div className="bg-red-500 h-1 rounded" style={{width: `${stage.dropoffPercent}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Trends & Predictions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-2">
          <div><span className="text-gray-600">Trend:</span> <strong className={
            analytics.trendDirection === 'Increasing' ? 'text-green-600' :
            analytics.trendDirection === 'Decreasing' ? 'text-red-600' : 'text-blue-600'
          }>{analytics.trendDirection || 'N/A'}</strong></div>
          <div><span className="text-gray-600">Avg Daily:</span> <strong className="text-gray-900">{analytics.avgDailyApplications.toFixed(1)}</strong></div>
          <div><span className="text-gray-600">Velocity:</span> <strong className="text-gray-900">{analytics.pipelineVelocity}</strong></div>
          <div><span className="text-gray-600">Next Week:</span> <strong className="text-gray-900">{analytics.expectedConversionsNextWeek}</strong></div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-gray-600">Best Day (Apps):</span> <strong className="text-gray-900">{analytics.bestDayForApplications || 'N/A'}</strong></div>
          <div><span className="text-gray-600">Best Day (Conv):</span> <strong className="text-gray-900">{analytics.bestDayForConversions || 'N/A'}</strong></div>
        </div>
      </div>

      {/* Benchmarks */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Performance vs Benchmarks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-semibold mb-1 text-gray-900">Conversion Rate</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Current:</span> <strong className="text-gray-900">{analytics.internalBenchmarks.avgConversionRate}%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span> <strong className="text-gray-900">{analytics.internalBenchmarks.targetConversionRate}%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gap:</span> 
                <strong className={parseFloat(analytics.internalBenchmarks.gap) < 0 ? 'text-green-600' : 'text-red-600'}>
                  {analytics.internalBenchmarks.gap}%
                </strong>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1 text-gray-900">Response Time</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Current:</span> <strong className="text-gray-900">{analytics.internalBenchmarks.avgResponseTime.toFixed(1)}d</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span> <strong className="text-gray-900">{analytics.internalBenchmarks.targetResponseTime}d</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gap:</span> 
                <strong className={parseFloat(analytics.internalBenchmarks.responseTimeGap) < 0 ? 'text-green-600' : 'text-red-600'}>
                  {analytics.internalBenchmarks.responseTimeGap}d
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity & Resources */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Capacity Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-gray-50 rounded">
            <span className="text-gray-600 block">Cand/Recruiter:</span>
            <p className="text-base md:text-lg font-bold text-gray-900">{analytics.capacityAnalysis.candidatesPerRecruiter}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <span className="text-gray-600 block">Peak Capacity:</span>
            <p className="text-base md:text-lg font-bold text-gray-900">{analytics.capacityAnalysis.peakCapacity}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <span className="text-gray-600 block">Utilization:</span>
            <p className="text-base md:text-lg font-bold text-gray-900">{analytics.capacityAnalysis.utilizationRate}%</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <span className="text-gray-600 block">Workload:</span>
            <p className="text-base md:text-lg font-bold text-gray-900">{analytics.recruiterWorkload.balanced ? '✓ Balanced' : '✗ Imbalanced'}</p>
          </div>
        </div>
      </div>

      {/* Status Counts */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold mb-2 text-gray-900">Detailed Status Counts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div><span className="text-gray-600">Jot Form:</span> <strong className="text-gray-900">{analytics.jotFormFilledCount}</strong></div>
          <div><span className="text-gray-600">Sign Doc:</span> <strong className="text-gray-900">{analytics.signDocReceivedCount}</strong></div>
          <div><span className="text-gray-600">Voice Note:</span> <strong className="text-gray-900">{analytics.voiceNoteApprovedCount}</strong></div>
          <div><span className="text-gray-600">Task:</span> <strong className="text-gray-900">{analytics.eligibilityTaskApprovedCount}</strong></div>
          <div><span className="text-gray-600">Interview:</span> <strong className="text-gray-900">{analytics.interviewDoneCount}</strong></div>
          <div><span className="text-gray-600">Trial Sched:</span> <strong className="text-gray-900">{analytics.trialScheduledCount}</strong></div>
          <div><span className="text-gray-600">Trial Done:</span> <strong className="text-gray-900">{analytics.trialDoneCount}</strong></div>
          <div><span className="text-gray-600">Joined:</span> <strong className="text-gray-900">{analytics.joinedCount}</strong></div>
          <div><span className="text-gray-600">90 Days:</span> <strong className="text-gray-900">{analytics.worked90DaysCount}</strong></div>
          <div><span className="text-gray-600">Not Connected:</span> <strong className="text-gray-900">{analytics.notConnectedCount}</strong></div>
          <div><span className="text-gray-600">No Response:</span> <strong className="text-gray-900">{analytics.messageNotReceivedCount}</strong></div>
          <div><span className="text-gray-600">Rejected:</span> <strong className="text-gray-900">{analytics.rejectedCount}</strong></div>
        </div>
      </div>

      {/* Diversity & Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-900">Diversity Metrics</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Position Diversity:</span> <strong className="text-gray-900">{analytics.positionDiversity}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Diversity:</span> <strong className="text-gray-900">{analytics.platformDiversity}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Experience Diversity:</span> <strong className="text-gray-900">{analytics.experienceDiversity}</strong>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-900">Quality Metrics</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Quality of Hire:</span> <strong className="text-gray-900">{analytics.qualityOfHire}y</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Quality:</span> <strong className="text-gray-900">{analytics.dataQualityIndex}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maturity Level:</span> <strong className="text-gray-900">{analytics.processMaturityLevel}/5</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Scores */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 md:p-4 rounded-lg shadow-sm">
        <h3 className="text-sm md:text-base font-bold mb-3 text-white">Overall Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm border border-white border-opacity-30">
            <span className="text-black block text-xs font-semibold mb-1">Health:</span>
            <p className="text-xl md:text-2xl font-bold text-black">{analytics.overallRecruitmentScore}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm border border-white border-opacity-30">
            <span className="text-black block text-xs font-semibold mb-1">Effectiveness:</span>
            <p className="text-xl md:text-2xl font-bold text-black">{analytics.processEffectiveness}%</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm border border-white border-opacity-30">
            <span className="text-black block text-xs font-semibold mb-1">Alignment:</span>
            <p className="text-xl md:text-2xl font-bold text-black">{analytics.strategicAlignment}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm border border-white border-opacity-30">
            <span className="text-black block text-xs font-semibold mb-1">Resource:</span>
            <p className="text-xl md:text-2xl font-bold text-black">{analytics.resourceUtilization}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-md w-full">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base md:text-xl font-black text-gray-900 truncate">Combined Recruitment Analytics</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Comprehensive metrics dashboard with advanced analytics & filters</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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

      {/* Navigation */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-[60px] md:top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          <nav className="flex space-x-8">
            {['overview', 'analytics'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  selectedView === view
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-700" />
              <h3 className="text-sm font-bold text-gray-900">Filters</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
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
                onClick={() => setSelectedFilters({platform: 'all', assignTo: 'all', currentStage: 'all', experience: 'all', position: 'all', dateFrom: '', dateTo: ''})}
                className="text-xs text-red-600 hover:text-red-800 font-semibold"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-1 bg-gray-100 rounded text-gray-700"
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
                {filterOptions.platforms.map(p => <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>)}
              </select>
              <select 
                value={selectedFilters.assignTo} 
                onChange={(e) => setSelectedFilters({...selectedFilters, assignTo: e.target.value})} 
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
              >
                {filterOptions.assignees.map(a => <option key={a} value={a}>{a === 'all' ? 'All Recruiters' : a}</option>)}
              </select>
              <select 
                value={selectedFilters.currentStage} 
                onChange={(e) => setSelectedFilters({...selectedFilters, currentStage: e.target.value})} 
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
              >
                {filterOptions.stages.map(s => <option key={s} value={s}>{s === 'all' ? 'All Stages' : s}</option>)}
              </select>
              <select 
                value={selectedFilters.experience} 
                onChange={(e) => setSelectedFilters({...selectedFilters, experience: e.target.value})} 
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
              >
                {filterOptions.experiences.map(e => <option key={e} value={e}>{e === 'all' ? 'All Experience' : e}</option>)}
              </select>
              <select 
                value={selectedFilters.position} 
                onChange={(e) => setSelectedFilters({...selectedFilters, position: e.target.value})} 
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
              >
                {filterOptions.positions.map(p => <option key={p} value={p}>{p === 'all' ? 'All Positions' : p}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <label className="text-xs text-gray-600 flex-shrink-0">Date Range:</label>
              <input 
                type="date" 
                value={selectedFilters.dateFrom}
                onChange={(e) => setSelectedFilters({...selectedFilters, dateFrom: e.target.value})}
                className="block w-full md:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
                placeholder="From"
              />
              <span className="text-xs text-gray-500 hidden md:inline">to</span>
              <input 
                type="date" 
                value={selectedFilters.dateTo}
                onChange={(e) => setSelectedFilters({...selectedFilters, dateTo: e.target.value})}
                className="block w-full md:w-auto rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-2 bg-white text-gray-900 font-medium"
                placeholder="To"
              />
              {(selectedFilters.dateFrom || selectedFilters.dateTo) && (
                <button
                  onClick={() => setSelectedFilters({...selectedFilters, dateFrom: '', dateTo: ''})}
                  className="text-xs text-red-600 hover:text-red-800 font-medium flex-shrink-0"
                >
                  Clear Dates
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4">
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'analytics' && renderAnalytics()}
      </div>

      {/* Funnel - Always visible below content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-6">
        {renderEnhancedFunnel()}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-4">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 text-center text-xs text-gray-500">
          <p className="break-words">Combined Dashboard with 100+ Metrics • {analytics.totalCandidates} candidates • {analytics.uniquePlatforms} platforms • {analytics.totalRecruiters} recruiters</p>
        </div>
      </div>
    </div>
  );
};

export default CombinedRecruitmentDashboard;