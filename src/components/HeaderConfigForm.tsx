import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CORSConfig {
  clientOrigin: string;
  method: string;
  contentType: string;
  customHeader: boolean;
  serverAllowOrigin: string;
  serverAllowMethods: string;
  serverAllowHeaders: string;
}

interface HeaderConfigFormProps {
  config: CORSConfig;
  onChange: (config: CORSConfig) => void;
}

const HeaderConfigForm = ({ config, onChange }: HeaderConfigFormProps) => {
  const update = (partial: Partial<CORSConfig>) => onChange({ ...config, ...partial });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Client side */}
      <div className="passport-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">✈️</span>
          <h3 className="font-display text-base font-bold">여행자 (클라이언트)</h3>
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Origin (출발지)</Label>
          <Select value={config.clientOrigin} onValueChange={(v) => update({ clientOrigin: v })}>
            <SelectTrigger className="font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="https://myapp.com">https://myapp.com</SelectItem>
              <SelectItem value="https://evil.com">https://evil.com</SelectItem>
              <SelectItem value="http://localhost:3000">http://localhost:3000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Method (비행편)</Label>
          <Select value={config.method} onValueChange={(v) => update({ method: v })}>
            <SelectTrigger className="font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET (일반 입국)</SelectItem>
              <SelectItem value="POST">POST (화물 반입)</SelectItem>
              <SelectItem value="PUT">PUT (자료 변경)</SelectItem>
              <SelectItem value="DELETE">DELETE (위험물)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Content-Type</Label>
          <Select value={config.contentType} onValueChange={(v) => update({ contentType: v })}>
            <SelectTrigger className="font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text/plain">text/plain (간단)</SelectItem>
              <SelectItem value="application/json">application/json (표준)</SelectItem>
              <SelectItem value="application/xml">application/xml (특수)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-mono text-xs">커스텀 헤더 (특수 화물)</Label>
          <Switch checked={config.customHeader} onCheckedChange={(v) => update({ customHeader: v })} />
        </div>
      </div>

      {/* Server side */}
      <div className="passport-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🖥️</span>
          <h3 className="font-display text-base font-bold">입국 심사관 (서버)</h3>
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Access-Control-Allow-Origin (비자)</Label>
          <Select value={config.serverAllowOrigin} onValueChange={(v) => update({ serverAllowOrigin: v })}>
            <SelectTrigger className="font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">* (모든 국가 허용)</SelectItem>
              <SelectItem value="https://myapp.com">https://myapp.com (특정 국가만)</SelectItem>
              <SelectItem value="none">없음 (비자 거부)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Allow-Methods (허용 비행편)</Label>
          <Input
            className="font-mono text-xs"
            value={config.serverAllowMethods}
            onChange={(e) => update({ serverAllowMethods: e.target.value })}
            placeholder="GET, POST"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-xs">Allow-Headers (허용 화물)</Label>
          <Input
            className="font-mono text-xs"
            value={config.serverAllowHeaders}
            onChange={(e) => update({ serverAllowHeaders: e.target.value })}
            placeholder="Content-Type, Authorization"
          />
        </div>
      </div>
    </div>
  );
};

export type { CORSConfig };
export default HeaderConfigForm;
