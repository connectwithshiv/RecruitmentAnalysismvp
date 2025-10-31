import { useState, useEffect } from 'react';

// API Service for fetching and processing recruitment data
export const useRecruitmentData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        if (!parsed.length) { 
          setData([]); 
          setLoading(false);
          return; 
        }
        
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
            firstConnectedCall: obj["Candidate - First Connected Call"] || '',
            messageNotReceived: obj["Message not received"] || '',
            rejected: obj["Rejected"] || '',
            willSubmitJotForm: obj["Will Submit Jot Form"] || '',
            notConnected: obj["Not Connected"] || '',
            jotFormFilled: obj["Jot form filled"] || '',
            informAudioPresentation: obj["Informing / Explaining about Submitting the Audio Presentation"] || '',
            audioSubmission: obj["Audio Submission"] || '',
            trainingProvided: obj["Training Provided"] || '',
            updatingTrainingGuidelines: obj["Updating Training Guidelines"] || '',
            revisedAudioApproved: obj["Revised Audio Presentation Received and Approved"] || '',
            eligibilityTaskSubmission: obj["Eligibility Task Submission"] || '',
            eligibilityTaskApproval: obj["Eligibility Task Approval"] || '',
            signingDocWithoutRatesSent: obj["Signing Documents & Sharing Joining Form send (Without Rates)"] || '',
            doubtsClarified1: obj["Doubts Clarified"] || '',
            signingDocWithoutRatesReceived: obj["Signing Documents & Sharing Joining Form Recived (Without Rates)"] || '',
            signingDocWithRatesShared: obj["Signing Documents & Sharing Joining Form shared (With Rates)"] || '',
            doubtsClarified2: headers.filter(h => h === "Doubts Clarified")[1] ? obj[headers.filter(h => h === "Doubts Clarified")[1]] || '' : '',
            signingDocWithRatesReceived: obj["Signing Documents & Sharing Joining Form Recived (With Rates)"] || '',
            referenceNumbersVerified: obj["Reference Numbers Checked and Verified"] || '',
            sharingVision: obj["Sharing Vision of Brand + Department + Task"] || '',
            doubtsClarified3: headers.filter(h => h === "Doubts Clarified")[2] ? obj[headers.filter(h => h === "Doubts Clarified")[2]] || '' : '',
            onboardingTaskAssignment: obj["Onboarding and Task Assignment"] || '',
            doubtsClarified4: headers.filter(h => h === "Doubts Clarified")[3] ? obj[headers.filter(h => h === "Doubts Clarified")[3]] || '' : '',
            message7Days: obj["Send Message After 7 Days → Ask about payment satisfaction and check whether they are achieving daily tentative payments"] || '',
            doubtsClarified5: headers.filter(h => h === "Doubts Clarified")[4] ? obj[headers.filter(h => h === "Doubts Clarified")[4]] || '' : '',
            message15Days: obj["Send Message After 15 Days → Assign Write-up Work"] || '',
            doubtsClarified6: headers.filter(h => h === "Doubts Clarified")[5] ? obj[headers.filter(h => h === "Doubts Clarified")[5]] || '' : '',
            message30Days: obj["Send Message After 30 Days → Assign Checking Work"] || '',
            doubtsClarified7: headers.filter(h => h === "Doubts Clarified")[6] ? obj[headers.filter(h => h === "Doubts Clarified")[6]] || '' : '',
            message45Days: obj["Send Message After 45 Days → Assign Team Member for Management"] || '',
            doubtsClarified8: headers.filter(h => h === "Doubts Clarified")[7] ? obj[headers.filter(h => h === "Doubts Clarified")[7]] || '' : '',
            messageDoubleTeam: obj["Send Message Double the Team Members Every Month"] || '',
            doubtsClarified9: headers.filter(h => h === "Doubts Clarified")[8] ? obj[headers.filter(h => h === "Doubts Clarified")[8]] || '' : ''
          };

          // Determine current stage based on the new pipeline
          let currentStage = 'Job Posting';
          
          if (statusFields.messageDoubleTeam) currentStage = 'Scaling Team';
          else if (statusFields.message45Days) currentStage = 'Team Management Assigned';
          else if (statusFields.message30Days) currentStage = 'Checking Work Assigned';
          else if (statusFields.message15Days) currentStage = 'Write-up Assigned';
          else if (statusFields.message7Days) currentStage = 'Payment Follow-up';
          else if (statusFields.onboardingTaskAssignment) currentStage = 'Onboarded';
          else if (statusFields.sharingVision) currentStage = 'Vision Shared';
          else if (statusFields.referenceNumbersVerified) currentStage = 'References Verified';
          else if (statusFields.signingDocWithRatesReceived) currentStage = 'Doc Received (With Rates)';
          else if (statusFields.signingDocWithRatesShared) currentStage = 'Doc Shared (With Rates)';
          else if (statusFields.signingDocWithoutRatesReceived) currentStage = 'Doc Received (Without Rates)';
          else if (statusFields.signingDocWithoutRatesSent) currentStage = 'Doc Sent (Without Rates)';
          else if (statusFields.eligibilityTaskApproval) currentStage = 'Eligibility Task Approved';
          else if (statusFields.eligibilityTaskSubmission) currentStage = 'Eligibility Task Submitted';
          else if (statusFields.revisedAudioApproved) currentStage = 'Audio Approved';
          else if (statusFields.updatingTrainingGuidelines) currentStage = 'Training Guidelines Updated';
          else if (statusFields.trainingProvided) currentStage = 'Training Provided';
          else if (statusFields.audioSubmission) currentStage = 'Audio Submitted';
          else if (statusFields.informAudioPresentation) currentStage = 'Audio Info Sent';
          else if (statusFields.jotFormFilled) currentStage = 'Jotform Filled';
          else if (statusFields.willSubmitJotForm) currentStage = 'Awaiting Jotform';
          else if (statusFields.firstConnectedCall) currentStage = 'First Call Done';
          else if (statusFields.messageSent) currentStage = 'Bulk Message Sent';
          else if (statusFields.dateOfApply) currentStage = 'Data Extracted';
          else if (statusFields.rejected) currentStage = 'Rejected';
          else if (statusFields.notConnected) currentStage = 'Not Connected';
          else if (statusFields.messageNotReceived) currentStage = 'Message Not Received';

          // Parse dates
          const dateApply = parseDateSafe(rawData.dateOfApply);
          const dateDataGiven = parseDateSafe(rawData.dateOfDataGiven);
          const dateJotFormFilled = parseDateSafe(statusFields.jotFormFilled);
          const dateFirstCall = parseDateSafe(statusFields.firstConnectedCall);
          const dateOnboarded = parseDateSafe(statusFields.onboardingTaskAssignment);

          // Calculate time metrics
          const daysInPipeline = dateApply ? getDaysDiff(dateApply, new Date()) : 0;
          const daysToFirstContact = (dateApply && dateFirstCall) ? getDaysDiff(dateApply, dateFirstCall) : null;
          const daysToJotForm = (dateApply && dateJotFormFilled) ? getDaysDiff(dateApply, dateJotFormFilled) : null;
          const daysToOnboarding = (dateApply && dateOnboarded) ? getDaysDiff(dateApply, dateOnboarded) : null;

          const totalCalls = countNonEmpty([statusFields.firstConnectedCall]);
          const totalMessages = countNonEmpty([
            statusFields.messageSent,
            statusFields.informAudioPresentation,
            statusFields.message7Days,
            statusFields.message15Days,
            statusFields.message30Days,
            statusFields.message45Days,
            statusFields.messageDoubleTeam
          ]);

          const totalTouchpoints = totalCalls + totalMessages;

          let engagementScore = 0;
          if (statusFields.messageSent && statusFields.firstConnectedCall) engagementScore += 20;
          if (statusFields.jotFormFilled) engagementScore += 20;
          if (statusFields.audioSubmission) engagementScore += 15;
          if (statusFields.eligibilityTaskSubmission) engagementScore += 15;
          if (statusFields.onboardingTaskAssignment) engagementScore += 30;

          return {
            ...rawData,
            ...statusFields,
            totalCalls,
            totalMessages,
            totalTouchpoints,
            currentStage,
            daysInPipeline,
            daysToFirstContact,
            daysToJotForm,
            daysToOnboarding,
            engagementScore,
            dateApplyDate: dateApply,
            dateDataGivenDate: dateDataGiven,
            dateJotFormFilledDate: dateJotFormFilled,
            dateFirstCallDate: dateFirstCall,
            dateOnboardedDate: dateOnboarded,
            jotFormFilledBool: hasDate(statusFields.jotFormFilled),
            rejectedBool: hasDate(statusFields.rejected),
            notConnectedBool: hasDate(statusFields.notConnected),
            messageSentBool: hasDate(statusFields.messageSent),
            firstCallBool: hasDate(statusFields.firstConnectedCall),
            onboardedBool: hasDate(statusFields.onboardingTaskAssignment)
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

  const refetch = () => {
    setLoading(true);
    setError(null);
    // Trigger re-fetch by updating a dependency
    window.location.reload();
  };

  return { data, loading, error, refetch };
};

// Export as default component for artifact
export default function APIService() {
  const { data, loading, error } = useRecruitmentData();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Service</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="mb-2"><strong>Status:</strong> {loading ? 'Loading...' : error ? 'Error' : 'Ready'}</p>
        <p className="mb-2"><strong>Records:</strong> {data.length}</p>
        {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
      </div>
      <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
        <h2 className="font-semibold mb-2">Usage:</h2>
        <pre className="text-sm bg-white p-3 rounded overflow-x-auto">
{`import { useRecruitmentData } from './apiService';

function MyComponent() {
  const { data, loading, error, refetch } = useRecruitmentData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data.length} candidates loaded</div>;
}`}
        </pre>
      </div>
    </div>
  );
}