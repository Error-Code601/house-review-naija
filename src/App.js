import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";

// ========================================================
// HIGHEST QUALITY PRE-LOADED NIGERIAN REAL ESTATE DATA SEEDS
// ========================================================
const PRE_LOADED_FEED = [
  {
    id: 1,
    address: "Block B, Flat 4, Agungi Estate (Agungi)",
    city: "Lagos",
    total: 3400000,
    comment:
      "The compound is nice and neat, but abeg make sure you ask about the pumping machine situation before paying. If NEPA takes light for more than two days, water stops running completely. Also, the street floods for at least 3 hours whenever there is heavy rain.",
    agent: { name: "Agent Sunday", phone: "08032145566", isScam: false },
    metrics: {
      commuteTime: "30-60 mins",
      ispStrength: "Excellent (5G/Fiber)",
      noiseLevel: "Moderate (Commercial edge)",
    },
    badges: { hasLight: true, floods: true },
    isVerifiedResident: true,
    validCount: 14,
    falseCount: 1,
    landlordReply:
      "We have updated our internal power backup matrix. A brand new central automated generator was linked in March 2026 to keep the central water pumps running even during grid blackouts.",
  },
  {
    id: 2,
    address: "14 Gana Street (Maitama)",
    city: "Abuja",
    total: 8500000,
    comment:
      "Top notch security and serenity. Perfect location for remote work, MTN Fiber network speed is consistently pushing past 150Mbps here. No landlord drama whatsoever, but the service charge increments can be quite unpredictable.",
    agent: {
      name: "Maitama Luxury Homes",
      phone: "08123456789",
      isScam: false,
    },
    metrics: {
      commuteTime: "0-15 mins (Near Hub)",
      ispStrength: "Excellent (5G/Fiber/Starlink)",
      noiseLevel: "Quiet & Serene",
    },
    badges: { hasLight: true, floods: false },
    isVerifiedResident: true,
    validCount: 28,
    falseCount: 0,
    landlordReply: null,
  },
  {
    id: 3,
    address: "Plot 8, Akala Express (Bodija Area)",
    city: "Ibadan",
    total: 1200000,
    comment:
      "Very quiet neighborhood, perfect if you are avoiding the Lagos chaos. Airtel 4G and Glo are solid. However, the caretaker here likes to form king—he will lock the central estate gate by exactly 11:00 PM, and if you are outside, you are sleeping out.",
    agent: { name: "Alhaji Caretaker", phone: "07055511223", isScam: true },
    metrics: {
      commuteTime: "15-30 mins",
      ispStrength: "Average (Stable 4G)",
      noiseLevel: "Quiet & Serene",
    },
    badges: { hasLight: false, floods: false },
    isVerifiedResident: false,
    validCount: 9,
    falseCount: 2,
    landlordReply: null,
  },
];

function App() {
  const [view, setView] = useState("landing");

  // ALGORITHM: Fallback to pre-loaded seeds if browser local storage memory is clean
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("naija_reviews");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : PRE_LOADED_FEED;
    }
    return PRE_LOADED_FEED;
  });

  const [filterCity, setFilterCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLandlordId, setActiveLandlordId] = useState(null);
  const [rebuttalText, setRebuttalText] = useState("");
  const [landlordVerifiedDoc, setLandlordVerifiedDoc] = useState(false);

  useEffect(() => {
    localStorage.setItem("naija_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (newReview) => {
    // Inserts newly submitted user records cleanly at the very top of the feed loop
    setReviews([newReview, ...reviews]);
    setView("landing"); // Auto-returns user back to landing page to see their live post
  };

  const handleAttest = (id, type) => {
    setReviews(
      reviews.map((rev) => {
        if (rev.id === id) {
          return {
            ...rev,
            validCount:
              type === "valid" ? (rev.validCount || 0) + 1 : rev.validCount,
            falseCount:
              type === "false" ? (rev.falseCount || 0) + 1 : rev.falseCount,
          };
        }
        return rev;
      })
    );
  };

  const submitLandlordReply = (id) => {
    if (!rebuttalText.trim()) return alert("Enter reply text!");
    if (!landlordVerifiedDoc)
      return alert("Security Block: Attach verification token document first!");

    setReviews(
      reviews.map((rev) => {
        if (rev.id === id)
          return {
            ...rev,
            landlordReply: rebuttalText,
            isLandlordVerified: true,
          };
        return rev;
      })
    );
    alert(
      "Verification Request Submitted! Vetting will complete within 24 hours."
    );
    setRebuttalText("");
    setLandlordVerifiedDoc(false);
    setActiveLandlordId(null);
  };

  const handleTakedownNotice = (id) => {
    if (
      window.confirm(
        "CONFIRM TAKEDOWN COMPLAINT:\nThis review will be flagged for content arbitration. Proceed?"
      )
    ) {
      alert(
        "Arbitration Ticket Generated! Modifiers will audit this report within 24 hours."
      );
    }
  };

  const checkAgentStatus = (phone) => {
    if (!phone || phone === "N/A")
      return { status: "Clean", color: "text-gray-500" };
    const flags = reviews.filter(
      (r) => r.agent && r.agent.phone === phone && r.agent.isScam
    ).length;
    if (flags >= 3)
      return {
        status: "❌ BANNED AGENT (FRAUD ALERTS)",
        color: "text-red-600 font-black animate-pulse",
      };
    if (flags > 0)
      return {
        status: `⚠️ Flagged (${flags} complaints)`,
        color: "text-amber-600 font-bold",
      };
    return {
      status: "✓ Unflagged Broker",
      color: "text-green-600 font-medium",
    };
  };

  const filteredReviews = reviews.filter((rev) => {
    const matchesCity = filterCity === "All" || rev.city === filterCity;
    const matchesSearch =
      rev.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // ========================================================
  // VIEW 1: LANDING PAGE RENDERING CONTROLLER
  // ========================================================
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white flex flex-col justify-between">
        {/* Top Header Navbar */}
        <nav className="flex justify-between items-center max-w-6xl mx-auto w-full px-6 py-6 border-b border-white/5">
          <h2 className="text-2xl font-black italic tracking-wider text-blue-400">
            NaijaHouseCheck 🇳🇬
          </h2>
          <button
            onClick={() => setView("app")}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-md"
          >
            + Write a Review
          </button>
        </nav>

        {/* Hero Area */}
        <main className="max-w-6xl mx-auto text-center space-y-6 px-6 pt-16 pb-12 w-full">
          <div className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-4 py-1.5 rounded-full font-black tracking-widest uppercase">
            Consumer Transparency for Nigerian Renters
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-3xl mx-auto">
            The Crowdsourced Transparency Portal for Real Estate
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto font-medium">
            Search unedited apartment histories, grid power metrics, flooding
            zones, and verified agent ratings across Lagos, Abuja, and Ibadan
            before you pay.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setView("app")}
              className="bg-blue-600 text-white font-black px-8 py-4 rounded-2xl text-lg hover:bg-blue-700 transition shadow-xl transform active:scale-95"
            >
              Access Dashboard / Add Review →
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-12 text-left">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-blue-500/30 transition duration-300">
              <h3 className="font-bold text-blue-400 text-sm uppercase tracking-wide">
                📄 The Receipt Wall
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Anonymized token verifications to unlock premium data tiering
                badges.
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition duration-300">
              <h3 className="font-bold text-purple-400 text-sm uppercase tracking-wide">
                🚫 Agent Blacklist
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Brokers with 3 automated fraud markers face permanent platform
                system bans.
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition duration-300">
              <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wide">
                💻 Remote-Work Score
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Filter locations by explicit localized ISP speeds and
                surrounding acoustic elements.
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-orange-500/30 transition duration-300">
              <h3 className="font-bold text-orange-400 text-sm uppercase tracking-wide">
                🌊 Commute Heatmaps
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Track traffic timelines to major employment corridors alongside
                severe flooding data.
              </p>
            </div>
          </div>

          {/* Public Audit Database Section */}
          <div className="pt-20 text-left max-w-2xl mx-auto space-y-6">
            <div className="text-center sm:text-left bg-gradient-to-r from-blue-900/20 to-transparent p-4 rounded-xl border border-blue-500/10">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Public Audit Database 🔍
              </h2>
              <p className="text-amber-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                ⚖️ Secure Right of Reply Active: Landlords must submit official
                deed/management documents to prove identity before rebuttals are
                published.
              </p>
            </div>

            {/* Instant Search Bar */}
            <input
              type="text"
              placeholder="🔍 Search street, area, compound name, or broker (e.g., 'Akala Express')..."
              className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-slate-500 font-medium outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* City Filters */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
              {["All", "Lagos", "Abuja", "Ibadan"].map((city) => (
                <button
                  key={city}
                  onClick={() => setFilterCity(city)}
                  className={`w-1/4 py-2 text-xs font-black rounded-xl transition ${
                    filterCity === city
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Render Public Review Cards */}
            <div className="space-y-4">
              {filteredReviews.length === 0 && (
                <p className="text-slate-500 text-center py-10 italic bg-white/5 rounded-2xl border border-white/10 text-sm">
                  No matching reviews loaded yet.
                </p>
              )}
              {filteredReviews.map((rev) => {
                const agentStatus = checkAgentStatus(rev.agent?.phone);
                return (
                  <div
                    key={rev.id}
                    className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3 hover:bg-white/[0.07] transition duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-lg text-white capitalize">
                            {rev.address}
                          </h4>
                          {rev.isVerifiedResident && (
                            <span className="bg-emerald-600/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-500/20">
                              ✓ VERIFIED TENANT
                            </span>
                          )}
                        </div>
                        <p className="text-green-400 font-bold text-xs mt-1">
                          Total Package Cost: ₦{rev.total.toLocaleString()}
                        </p>
                      </div>
                      <span className="bg-white/5 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10">
                        {rev.city}
                      </span>
                    </div>

                    <div className="p-3 bg-white/[0.02] rounded-xl text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 border border-white/5">
                      <div>
                        📍 <span>Commute:</span> {rev.metrics?.commuteTime}
                      </div>
                      <div>
                        📡 <span>ISP Speed:</span> {rev.metrics?.ispStrength}
                      </div>
                      <div>
                        🔊 <span>Acoustics:</span> {rev.metrics?.noiseLevel}
                      </div>
                    </div>

                    {rev.agent && (
                      <div className="p-2.5 bg-purple-500/5 rounded-xl border border-purple-500/10 flex justify-between items-center text-[11px]">
                        <p className="text-slate-400">
                          Linked Broker:{" "}
                          <span className="text-slate-200 font-bold">
                            {rev.agent.name}
                          </span>{" "}
                          ({rev.agent.phone})
                        </p>
                        <span className={`text-[10px] ${agentStatus.color}`}>
                          {agentStatus.status}
                        </span>
                      </div>
                    )}

                    <p className="text-slate-300 text-sm leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    {rev.landlordReply && (
                      <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-xs">
                        <p className="font-black text-purple-400 uppercase tracking-wider text-[10px]">
                          🛡️ Verified Property Owner Upgrade Response:
                        </p>
                        <p className="text-slate-200 font-medium mt-0.5">
                          "{rev.landlordReply}"
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-white/5 text-xs">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAttest(rev.id, "valid")}
                          className="bg-white/5 text-slate-300 border border-white/5 px-3 py-1.5 rounded-xl text-xs"
                        >
                          👍 Real ({rev.validCount || 0})
                        </button>
                        <button
                          onClick={() => handleAttest(rev.id, "false")}
                          className="bg-white/5 text-slate-300 border border-white/5 px-3 py-1.5 rounded-xl text-xs"
                        >
                          👎 Fake ({rev.falseCount || 0})
                        </button>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleTakedownNotice(rev.id)}
                          className="text-slate-500 hover:text-red-400 text-[11px]"
                        >
                          Arbitration Flag
                        </button>
                        <button
                          onClick={() =>
                            setActiveLandlordId(
                              activeLandlordId === rev.id ? null : rev.id
                            )
                          }
                          className="text-blue-400 hover:underline font-bold text-[11px]"
                        >
                          Are you the Landlord? Reply
                        </button>
                      </div>
                    </div>

                    {activeLandlordId === rev.id && (
                      <div className="mt-2 bg-slate-900 p-4 rounded-xl border border-white/10 space-y-3">
                        <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-[11px] text-amber-300">
                          🛡️{" "}
                          <span className="font-bold">
                            Identity Verification Protocol:
                          </span>{" "}
                          Attach proof of ownership (e.g., Land tax slip,
                          Allocation ledger or C of O) to block fraud.
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5">
                          <span className="text-xs text-slate-400">
                            Attach verification file (.pdf, .png, .jpg)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setLandlordVerifiedDoc(true);
                              alert(
                                "Authorization document token cached successfully! 📁"
                              );
                            }}
                            className={`px-3 py-1 rounded text-xs font-bold transition ${
                              landlordVerifiedDoc
                                ? "bg-green-600 text-white"
                                : "bg-white/10 text-slate-200"
                            }`}
                          >
                            {landlordVerifiedDoc
                              ? "✓ Attached"
                              : "Upload Proof"}
                          </button>
                        </div>
                        <textarea
                          value={rebuttalText}
                          onChange={(e) => setRebuttalText(e.target.value)}
                          placeholder="Type official clarification or logged upgrade features..."
                          className="w-full p-2 border border-white/10 text-xs rounded-lg outline-none bg-slate-950 text-white h-16"
                        />
                        <div className="flex justify-end gap-1.5 text-[11px]">
                          <button
                            onClick={() => {
                              setActiveLandlordId(null);
                              setLandlordVerifiedDoc(false);
                            }}
                            className="px-2.5 py-1 bg-white/10 text-slate-300 rounded-md font-bold"
                          >
                            Close
                          </button>
                          <button
                            onClick={() => submitLandlordReply(rev.id)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold shadow"
                          >
                            Submit Verified Rebuttal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Corporate Footer */}
        <footer className="bg-black/40 border-t border-white/5 w-full text-left text-sm text-slate-400 pt-12 pb-6 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 mb-6">
            <div>
              <h3 className="text-white font-black text-lg mb-2">
                NaijaHouseCheck
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Independent public utility portal for tracking structural
                parameters and broker indices across major Nigerian cities.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Explore
              </h4>
              <ul className="space-y-1.5 text-xs">
                {["Addresses", "Agents Registry", "Tenant Reviews"].map((l) => (
                  <li
                    key={l}
                    className="hover:text-blue-400 transform hover:scale-105 hover:translate-x-1 transition duration-300 cursor-pointer origin-left"
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Insights
              </h4>
              <ul className="space-y-1.5 text-xs">
                {["Data Blog", "Rental Guides", "City Flood Rankings"].map(
                  (l) => (
                    <li
                      key={l}
                      className="hover:text-blue-400 transform hover:scale-105 hover:translate-x-1 transition duration-300 cursor-pointer origin-left"
                    >
                      {l}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">
                Legal
              </h4>
              <ul className="space-y-1.5 text-xs">
                {["Privacy Policy", "Terms of Use", "Arbitration Notice"].map(
                  (l) => (
                    <li
                      key={l}
                      className="hover:text-blue-400 transform hover:scale-105 hover:translate-x-1 transition duration-300 cursor-pointer origin-left"
                    >
                      {l}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto border-t border-white/5 pt-4 text-center text-xs text-slate-500">
            © 2026 NaijaHouseCheck Framework Inc. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  // ========================================================
  // VIEW 2: FORM WIZARD VIEW PANEL
  // ========================================================
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView("landing")}
          >
            <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
              <span className="text-emerald-500">🏠</span> NaijaHouseCheck
            </h1>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            <span
              className="hover:text-emerald-500 cursor-pointer transition"
              onClick={() => setView("landing")}
            >
              Home
            </span>
            <span
              className="hover:text-emerald-500 cursor-pointer text-xs bg-gray-50 border p-2 rounded-xl transition"
              onClick={() => setView("landing")}
            >
              | Cancel & Return
            </span>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4">
        <ReviewForm addReview={addReview} />
      </div>
    </div>
  );
}

export default App;
