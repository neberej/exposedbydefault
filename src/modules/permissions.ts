const permissionsToCheck = [
  'geolocation', 'notifications', 'camera',
  'microphone', 'persistent-storage', 'background-sync'
];

export async function getPermissionsStatus(): Promise<FingerprintData[]> {
  const results: FingerprintData[] = [];

  for (const perm of permissionsToCheck) {
    try {
      const p = await (navigator.permissions as any).query({ name: perm });
      results.push({
        category: 'Permissions',
        key: perm,
        value: p.state,
        tooltip: `Current state of the ${perm} permission. Obtained via navigator.permissions.query({name: '${perm}'})`
      });
    } catch {
      results.push({
        category: 'Permissions',
        key: perm,
        value: 'Not supported',
        tooltip: `Browser does not support querying the ${perm} permission.`
      });
    }
  }

  return results;
}