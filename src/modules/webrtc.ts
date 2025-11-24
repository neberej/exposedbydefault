import type { FingerprintData } from "./types";

export function getWebRTCIPs(): FingerprintData[] {
  const hostCandidates: any[] = [];
  const stunCandidates: any[] = [];
  const rawLines: string[] = [];

  try {
    const rtc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    rtc.createDataChannel("x");
    rtc.createOffer().then((offer) => rtc.setLocalDescription(offer));

    rtc.onicecandidate = (event) => {
      if (!event.candidate) return;

      const c = event.candidate.candidate;
      rawLines.push(c);

      // Full ICE parsing
      const parsed = parseCandidate(c);
      if (!parsed) return;

      if (parsed.type === "host") hostCandidates.push(parsed);
      if (parsed.type === "srflx") stunCandidates.push(parsed);
    };

    // close after 3 seconds
    setTimeout(() => rtc.close(), 3000);
  } catch (err) {
    return [
      {
        category: "Network",
        key: "WebRTC",
        value: "WebRTC not supported or blocked",
        tooltip: "RTCPeerConnection threw an error.",
      },
    ];
  }

  return [
    {
      category: "Network",
      key: "WebRTC Host Candidates",
      value: hostCandidates.length
        ? JSON.stringify(hostCandidates, null, 2)
        : "None",
      tooltip: "Local network interfaces discovered (host ICE candidates).",
    },
    {
      category: "Network",
      key: "WebRTC STUN Candidates",
      value: stunCandidates.length
        ? JSON.stringify(stunCandidates, null, 2)
        : "None",
      tooltip: "Public IP addresses discovered via STUN (srflx candidates).",
    },
    {
      category: "Network",
      key: "WebRTC Raw ICE Lines",
      value: rawLines.length
        ? rawLines.join(" | ")
        : "No candidates generated",
      tooltip: "Raw ICE candidate SDP lines for detailed fingerprinting.",
    },
  ];
}

// ICE Candidate Parser 
function parseCandidate(candidate: string) {
  // example:
  // candidate:842163049 1 udp 1677729535 192.168.1.5 53654 typ host generation 0
  const regex =
    /candidate:(\S+)\s+(\d+)\s+(\S+)\s+(\d+)\s+([\w\.:]+)\s+(\d+)\s+typ\s+(\S+)(?:\s+raddr\s+([\w\.:]+)\s+rport\s+(\d+))?/;

  const match = candidate.match(regex);
  if (!match) return null;

  return {
    foundation: match[1],
    component: match[2],
    protocol: match[3],
    priority: match[4],
    address: match[5],
    port: match[6],
    type: match[7],
    relatedAddress: match[8] || null,
    relatedPort: match[9] || null,
  };
}
