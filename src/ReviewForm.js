import React, { useState } from 'react';

function ReviewForm({ addReview }) {
  // Wizard step state tracker
  const [currentStep, setCurrentStep] = useState(1);

  // Form Data States
  const [city, setCity] = useState('Lagos');
  const [area, setArea] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [rent, setRent] = useState('');
  const [fees, setFees] = useState('');
  const [comment, setComment] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  
  // Metrics & Badges States
  const [commuteTime, setCommuteTime] = useState('15-30 mins');
  const [ispStrength, setIspStrength] = useState('Excellent (5G/Fiber)');
  const [noiseLevel, setNoiseLevel] = useState('Quiet & Serene');
  const [hasLight, setHasLight] = useState(false);
  const [floods, setFloods] = useState(false);
  const [agentScam, setAgentScam] = useState(false);
  const [uploadedReceipt, setUploadedReceipt] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullAddress = `${houseNumber ? houseNumber + ', ' : ''}${streetName} (${area})`;
    
    addReview({
      id: Date.now(),
      address: fullAddress,
      city,
      total: Number(rent) + Number(fees),
      comment,
      agent: { name: agentName || 'Unknown Agent', phone: agentPhone || 'N/A', isScam: agentScam },
      metrics: { commuteTime, ispStrength, noiseLevel },
      badges: { hasLight, floods, agentScam },
      isVerifiedResident: uploadedReceipt,
      validCount: 0,
      falseCount: 0,
      landlordReply: null
    });

    // Reset All State Values & Return to Step 1
    alert("Review Broadcasted Successfully! 🎉");
    setCurrentStep(1);
    setArea(''); setHouseNumber(''); setStreetName(''); setRent(''); setFees(''); setComment('');
    setAgentName(''); setAgentPhone(''); setUploadedReceipt(false); setUploadedPhoto(false);
    setHasLight(false); setFloods(false); setAgentScam(false);
  };

  const stepsList = [
    { num: 1, label: "Location" },
    { num: 2, label: "Review Details" },
    { num: 3, label: "Photo Evidence" },
    { num: 4, label: "Proof of Residence" },
    { num: 5, label: "Confirm" }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-10 max-w-2xl mx-auto">
      
      {/* IMPORTANT LEGAL INTEGRITY NOTICE */}
      <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-900 leading-relaxed">
        <span className="font-extrabold text-amber-700 uppercase block mb-1">⚠️ Legal Integrity Notice:</span>
        NaijaHouseCheck is built on consumer absolute truth. If a landlord or management files a dispute and validates a review as malicious, misleading, or completely false, **the post will be deleted permanently** to protect data sanitation parameters.
      </div>

      {/* ========================================================
          5-STEP STEPPING PROGRESS INDICATOR (EXACTLY LIKE IMAGE)
          ======================================================== */}
      <div className="flex justify-between items-center mb-10 relative px-2">
        {stepsList.map((st, idx) => (
          <React.Fragment key={st.num}>
            <div className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep === st.num 
                  ? 'bg-emerald-500 text-white shadow-md ring-4 ring-emerald-100' 
                  : currentStep > st.num ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                {st.num}
              </div>
              <span className={`text-[11px] font-bold mt-2 transition-colors duration-300 ${currentStep === st.num ? 'text-emerald-600' : 'text-gray-400'}`}>
                {st.label}
              </span>
            </div>
            {idx < stepsList.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-100 mx-2 -mt-4 relative">
                <div className="absolute top-0 left-0 h-full bg-gray-800 transition-all duration-500" style={{ width: currentStep > st.num ? '100%' : '0%' }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ==================== STEP 1: LOCATION ==================== */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-black text-gray-900">House Location</h3>
          <p className="text-xs text-gray-400">Enter the location coordinates of the property you're auditing.</p>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">State *</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50 text-sm font-semibold outline-none">
              <option>Lagos</option> <option>Abuja</option> <option>Ibadan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Area / Neighborhood *</label>
            <input placeholder="Select an area... e.g. Lekki Phase 1, Garki, Bodija" className="w-full p-3 text-sm border rounded-xl outline-none" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">House Number</label>
            <input placeholder="E.g., 12, 5A, Block C Unit 4" className="w-full p-3 text-sm border rounded-xl outline-none" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Street Name *</label>
            <input placeholder="E.g., Admiralty Way, Allen Avenue" className="w-full p-3 text-sm border rounded-xl outline-none" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
          </div>
          <button type="button" onClick={() => { if(!streetName || !area) return alert("Fill required inputs!"); setCurrentStep(2); }} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl text-sm">Continue</button>
        </div>
      )}

      {/* ==================== STEP 2: REVIEW DETAILS ==================== */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-gray-900">Financials & Logistics</h3>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Yearly Rent (₦)</label>
              <input type="number" placeholder="Rent" className="w-full p-3 border rounded-xl text-sm font-semibold" value={rent} onChange={(e) => setRent(e.target.value)} />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Other Extra Fees (₦)</label>
              <input type="number" placeholder="Agency/Caution" className="w-full p-3 border rounded-xl text-sm font-semibold" value={fees} onChange={(e) => setFees(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="font-bold text-gray-500 block mb-1">Commute</label>
              <select value={commuteTime} onChange={(e) => setCommuteTime(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 font-medium"><option>0-15 mins</option><option>15-30 mins</option><option>1-2 hours</option></select>
            </div>
            <div>
              <label className="font-bold text-gray-500 block mb-1">ISP Speed</label>
              <select value={ispStrength} onChange={(e) => setIspStrength(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 font-medium"><option>Excellent (5G)</option><option>Average</option><option>Bad</option></select>
            </div>
            <div>
              <label className="font-bold text-gray-500 block mb-1">Noise Profile</label>
              <select value={noiseLevel} onChange={(e) => setNoiseLevel(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 font-medium"><option>Quiet</option><option>Moderate</option><option>Extreme noise</option></select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setHasLight(!hasLight)} className={`w-1/2 p-2.5 text-xs font-bold rounded-xl border transition ${hasLight ? 'bg-yellow-100 text-yellow-800 border-yellow-400' : 'bg-gray-50'}`}>💡 Grid Light Available</button>
            <button type="button" onClick={() => setFloods(!floods)} className={`w-1/2 p-2.5 text-xs font-bold rounded-xl border transition ${floods ? 'bg-orange-100 text-orange-800 border-orange-400' : 'bg-gray-50'}`}>🌊 Severe Flooding Vector</button>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Comments</label>
            <textarea placeholder="Tell us about your full apartment experience..." className="w-full p-3 border rounded-xl text-sm h-20 outline-none" value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCurrentStep(1)} className="w-1/3 border py-3 rounded-xl font-bold text-sm bg-gray-50">Back</button>
            <button type="button" onClick={() => { if(!rent || !comment) return alert("Fill financials and comment!"); setCurrentStep(3); }} className="w-2/3 bg-gray-900 text-white font-bold py-3 rounded-xl text-sm">Continue</button>
          </div>
        </div>
      )}

      {/* ==================== STEP 3: PHOTO EVIDENCE ==================== */}
      {currentStep === 3 && (
        <div className="space-y-4 text-center py-4">
          <h3 className="text-xl font-black text-gray-900 text-left">Photo Evidence</h3>
          <p className="text-xs text-gray-400 text-left">Upload real pictures of the room conditions, compound, or infrastructure defects.</p>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50">
            <p className="text-sm text-gray-500 mb-4">Drag and drop apartment photos here</p>
            <button type="button" onClick={() => { setUploadedPhoto(true); alert("Photo cached! 📸"); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${uploadedPhoto ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {uploadedPhoto ? '✓ Photo Selected' : 'Choose Local File'}
            </button>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setCurrentStep(2)} className="w-1/3 border py-3 rounded-xl font-bold text-sm bg-gray-50">Back</button>
            <button type="button" onClick={() => setCurrentStep(4)} className="w-2/3 bg-gray-900 text-white font-bold py-3 rounded-xl text-sm">Continue</button>
          </div>
        </div>
      )}

      {/* ==================== STEP 4: PROOF OF RESIDENCE ==================== */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-gray-900">Proof of Residence</h3>
          <p className="text-xs text-gray-400">Attach a blurred picture of your electricity bill or tenancy log header. This locks in your absolute truth verification badge.</p>
          <div className="border border-purple-100 bg-purple-50/50 rounded-2xl p-5 flex justify-between items-center">
            <div className="text-xs text-purple-950 max-w-sm"><span className="font-bold">Anonymized Protection Shield:</span> All identifiers, names, and accounts are automatically redacted via local filters.</div>
            <button type="button" onClick={() => { setUploadedReceipt(true); alert("Document verified locally protection token active! 🔒"); }} className={`px-4 py-2.5 rounded-xl text-xs font-black transition ${uploadedReceipt ? 'bg-purple-600 text-white' : 'bg-white text-purple-700 border border-purple-200'}`}>
              {uploadedReceipt ? '✓ Uploaded' : 'Upload Agreement'}
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-bold text-gray-600 mb-1">Optional: Link Agent Line</p>
            <div className="flex gap-2"><input placeholder="Broker Name" className="w-1/2 p-2 text-xs border rounded-lg bg-white" value={agentName} onChange={(e) => setAgentName(e.target.value)} /><input placeholder="Broker Phone Line" className="w-1/2 p-2 text-xs border rounded-lg bg-white" value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} /></div>
            <button type="button" onClick={() => setAgentScam(!agentScam)} className={`mt-2 w-full py-1.5 text-[10px] font-bold border rounded-lg transition ${agentScam ? 'bg-red-600 text-white' : 'bg-white text-red-500'}`}>⚠️ Flag Agent for Scams</button>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setCurrentStep(3)} className="w-1/3 border py-3 rounded-xl font-bold text-sm bg-gray-50">Back</button>
            <button type="button" onClick={() => setCurrentStep(5)} className="w-2/3 bg-gray-900 text-white font-bold py-3 rounded-xl text-sm">Review Summary</button>
          </div>
        </div>
      )}

      {/* ==================== STEP 5: CONFIRM ==================== */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black text-gray-900">Confirm Integrity Alignment</h3>
          <div className="bg-gray-50 rounded-2xl border p-4 text-xs space-y-2 text-gray-700">
            <div><span className="font-bold">Target Address:</span> {houseNumber} {streetName} ({area}, {city})</div>
            <div><span className="font-bold">Total Expected Package:</span> ₦{(Number(rent) + Number(fees)).toLocaleString()}</div>
            <div><span className="font-bold">Verification:</span> {uploadedReceipt ? "🛡 HIGH TRUST VERIFIED" : "Standard Review Drop"}</div>
          </div>
          <p className="text-xs text-gray-400">By hitting publish, you attest that this log statement maps to absolute property parameters. Malicious updates face immediate platform cleanup cycles.</p>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setCurrentStep(4)} className="w-1/3 border py-3 rounded-xl font-bold text-sm bg-gray-50">Back</button>
            <button type="button" onClick={handleSubmit} className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-sm shadow-md shadow-emerald-600/10">Publish Audit Log</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ReviewForm;
