const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');
module.exports = function municipalNetwork(config) {
  config = withAndroidManifest(config, mod => {
    mod.modResults.manifest.application[0].$['android:networkSecurityConfig'] = '@xml/municipal_network_security';
    return mod;
  });
  return withDangerousMod(config, ['android', mod => {
    const directory = path.join(mod.modRequest.platformProjectRoot, 'app/src/main/res/xml');
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'municipal_network_security.xml'), `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">consultas.municportillo.gob.pe</domain>
    <domain includeSubdomains="false">sathuancayo.fortiddns.com</domain>
  </domain-config>
</network-security-config>
`);
    return mod;
  }]);
};
