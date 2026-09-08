import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Save,
  RotateCcw,
  CheckCircle2,
  Globe,
  MessageCircle,
  HelpCircle,
  Building2,
  Truck,
  Layers,
  Settings2,
  ExternalLink,
} from 'lucide-react';
import { aiAssistantService } from '@/services/aiAssistantService';
import { AIAssistantConfig, AssistantLanguage } from '@/types/assistant';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AIAssistantConfigModule: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<AIAssistantConfig>(aiAssistantService.getConfig());
  const [activeLangTab, setActiveLangTab] = useState<AssistantLanguage>('en');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Test chat inside admin
  const [testInput, setTestInput] = useState('');
  const [testMessages, setTestMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: config.welcomeMessages.en,
    },
  ]);
  const [isTestTyping, setIsTestTyping] = useState(false);

  const handleSave = () => {
    aiAssistantService.updateConfig(config);
    setSavedSuccess(true);
    toast({
      title: 'AI Assistant Settings Saved',
      description: 'Mock conversation engine configuration updated successfully.',
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('mwf_ai_assistant_config');
    const resetConf = aiAssistantService.getConfig();
    setConfig(resetConf);
    toast({
      title: 'Reset to System Defaults',
      description: 'Configuration restored to default atelier settings.',
    });
  };

  const handleSendTest = async (queryText?: string) => {
    const text = (queryText || testInput).trim();
    if (!text) return;

    setTestMessages((prev) => [...prev, { sender: 'user', text }]);
    setTestInput('');
    setIsTestTyping(true);

    try {
      const response = await aiAssistantService.sendMessage(text, {
        language: activeLangTab,
      });
      setTestMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: response.message.text },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-semibold text-sm text-foreground">
              Mock AI Assistant Architecture (Phase 1 Prototype)
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              This module manages the conversational flows, multilingual knowledge, and WhatsApp handoff routing. The frontend is decoupled and ready for a seamless real backend AI (Gemini / LLM) plug-in in the next phase.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs gap-1.5 bg-primary text-primary-foreground"
          >
            {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved!' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Panels */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. General & Identity */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-semibold text-base text-foreground">
                  Bot Identity & Status
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-enabled" className="text-xs font-medium">
                  {config.enabled ? 'Active on Store' : 'Disabled'}
                </Label>
                <Switch
                  id="ai-enabled"
                  checked={config.enabled}
                  onCheckedChange={(val) => setConfig({ ...config, enabled: val })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Assistant Display Name
                </Label>
                <Input
                  className="mt-1 text-xs"
                  value={config.assistantName}
                  onChange={(e) => setConfig({ ...config, assistantName: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Sub-title / Badge
                </Label>
                <Input
                  className="mt-1 text-xs"
                  value={config.titleBadge}
                  onChange={(e) => setConfig({ ...config, titleBadge: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 2. Multilingual Greetings & Starter Prompts */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-semibold text-base text-foreground">
                  Multilingual Prompts & Greetings
                </h3>
              </div>
              <Tabs
                value={activeLangTab}
                onValueChange={(v) => setActiveLangTab(v as AssistantLanguage)}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="en" className="text-xs px-2.5">
                    English
                  </TabsTrigger>
                  <TabsTrigger value="ar" className="text-xs px-2.5">
                    العربية (Arabic)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Welcome Message ({activeLangTab.toUpperCase()})
              </Label>
              <Textarea
                rows={3}
                className="mt-1 text-xs leading-relaxed"
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                value={config.welcomeMessages[activeLangTab]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    welcomeMessages: {
                      ...config.welcomeMessages,
                      [activeLangTab]: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Starter Questions ({activeLangTab.toUpperCase()})
              </Label>
              <div className="space-y-2 mt-1">
                {config.starterQuestions[activeLangTab]?.map((q, idx) => (
                  <Input
                    key={idx}
                    className="text-xs"
                    dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                    value={q}
                    onChange={(e) => {
                      const updated = [...config.starterQuestions[activeLangTab]];
                      updated[idx] = e.target.value;
                      setConfig({
                        ...config,
                        starterQuestions: {
                          ...config.starterQuestions,
                          [activeLangTab]: updated,
                        },
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3. Business Knowledge & Wholesale Rules */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-semibold text-base text-foreground">
                Business Knowledge & Policy Grounding
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Showroom Address in Dubai
                </Label>
                <Input
                  className="mt-1 text-xs"
                  value={config.businessKnowledge.showroomAddress}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      businessKnowledge: {
                        ...config.businessKnowledge,
                        showroomAddress: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Free Delivery Threshold (AED)
                </Label>
                <Input
                  type="number"
                  className="mt-1 text-xs"
                  value={config.businessKnowledge.freeShippingThreshold}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      businessKnowledge: {
                        ...config.businessKnowledge,
                        freeShippingThreshold: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Wholesale Minimum Order (MOQ)
                </Label>
                <Input
                  type="number"
                  className="mt-1 text-xs"
                  value={config.businessKnowledge.wholesaleMinQty}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      businessKnowledge: {
                        ...config.businessKnowledge,
                        wholesaleMinQty: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* 4. WhatsApp Handoff Configuration */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <h3 className="font-serif font-semibold text-base text-foreground">
                WhatsApp Handoff Integration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Dedicated Concierge WhatsApp Number
                </Label>
                <Input
                  className="mt-1 text-xs"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Default Pre-filled Message
                </Label>
                <Input
                  className="mt-1 text-xs"
                  value={config.whatsappDefaultMessage}
                  onChange={(e) =>
                    setConfig({ ...config, whatsappDefaultMessage: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Testing Playground */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col h-[680px]">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-serif font-semibold text-sm text-foreground">
                  Live Test Simulator
                </h4>
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Active Lang: {activeLangTab.toUpperCase()}
              </span>
            </div>

            {/* Quick Test Starter Pills */}
            <div className="py-2 flex flex-wrap gap-1 border-b border-border/60">
              <button
                onClick={() => handleSendTest('Show me black Abayas')}
                className="text-[10px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors"
              >
                Black Abayas
              </button>
              <button
                onClick={() => handleSendTest('Do you have anything under AED 300?')}
                className="text-[10px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors"
              >
                Under AED 300
              </button>
              <button
                onClick={() => handleSendTest('I want 50 Abayas for wholesale')}
                className="text-[10px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors"
              >
                50 Abayas Wholesale
              </button>
              <button
                onClick={() => handleSendTest('Do you deliver in Dubai?')}
                className="text-[10px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors"
              >
                Dubai Delivery
              </button>
            </div>

            {/* Test Conversation Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/20 rounded-lg my-2">
              {testMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] text-xs p-2.5 rounded-xl whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTestTyping && (
                <div className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span>Atelier AI is typing response...</span>
                </div>
              )}
            </div>

            {/* Test Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Input
                placeholder="Test assistant with a prompt..."
                className="text-xs h-9"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendTest();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => handleSendTest()}
                className="h-9 px-3 text-xs bg-primary text-primary-foreground"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
