import type { FingerprintData } from './types';

export async function getWebRTCIPs(): Promise<FingerprintData[]> {
  return new Promise(resolve => {
    const hostCandidates: any[] = [];
    const stunCandidates: any[] = [];
    const rawLines: string[] = [];

    let rtc: RTCPeerConnection;

    try {
      rtc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
    } catch {
      resolve([
        {
          category: 'Network',
          key: 'WebRTC',
          value: 'WebRTC not supported or blocked',
          tooltip: 'RTCPeerConnection could not be created.',
        },
      ]);

      return;
    }

    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      rtc.close();

      resolve([
        {
          category: 'Network',
          key: 'WebRTC Host Candidates',
          value: hostCandidates.length
            ? JSON.stringify(hostCandidates)
            : 'None',
          tooltip: 'Host ICE candidates exposed during WebRTC gathering.',
        },
        {
          category: 'Network',
          key: 'WebRTC STUN Candidates',
          value: stunCandidates.length
            ? JSON.stringify(stunCandidates)
            : 'None',
          tooltip: 'Server-reflexive ICE candidates obtained through STUN.',
        },
        {
          category: 'Network',
          key: 'WebRTC Raw ICE Lines',
          value: rawLines.length
            ? rawLines.join(' | ')
            : 'No candidates generated',
          tooltip: 'Raw ICE candidate lines produced during WebRTC gathering.',
        },
      ]);
    };

    rtc.onicecandidate = event => {
      if (!event.candidate) {
        finish();
        return;
      }

      const candidate = event.candidate.candidate;
      rawLines.push(candidate);

      const parsed = parseCandidate(candidate);

      if (!parsed) return;

      if (parsed.type === 'host') {
        hostCandidates.push(parsed);
      }

      if (parsed.type === 'srflx') {
        stunCandidates.push(parsed);
      }
    };

    rtc.createDataChannel('x');

    rtc.createOffer()
      .then(offer => rtc.setLocalDescription(offer))
      .catch(finish);

    setTimeout(finish, 3000);
  });
}

function parseCandidate(candidate: string) {
  const regex =
    /candidate:(\S+)\s+(\d+)\s+(\S+)\s+(\d+)\s+(\S+)\s+(\d+)\s+typ\s+(\S+)(?:\s+raddr\s+(\S+)\s+rport\s+(\d+))?/;

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