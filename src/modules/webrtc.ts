import type { FingerprintData } from './types';

export function getWebRTCIPs(): FingerprintData[] {
  const ips: string[] = [];
  const rtc = new (window as any).RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  rtc.createDataChannel('');
  rtc.createOffer().then((offer: any) => rtc.setLocalDescription(offer));

  rtc.onicecandidate = (e: any) => {
    if (!e.candidate) return;
    const ip = e.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
    if (ip && !ips.includes(ip[1]) && !ip[1].startsWith('192.168') && ip[1] !== '127.0.0.1') ips.push(ip[1]);
  };

  setTimeout(() => rtc.close(), 3000);

  return [{ category: 'Network', key: 'Local IPs (WebRTC)', value: ips.length > 0 ? ips.join(', ') : 'None leaked', tooltip: 'Local IP addresses revealed via WebRTC ICE candidates.' }];
}
