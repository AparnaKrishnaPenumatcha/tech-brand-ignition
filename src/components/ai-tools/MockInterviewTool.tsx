
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAITools } from '@/hooks/useAITools';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MockInterviewToolProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MockInterviewTool: React.FC<MockInterviewToolProps> = ({ onBack }) => {
  const [role, setRole] = useState('');
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral'>('behavioral');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const { conductMockInterview, loading } = useAITools();
  const { toast } = useToast();

  const startInterview = async () => {
    if (!role.trim()) {
      toast({
        title: "Role required",
        description: "Please enter the role you're interviewing for.",
        variant: "destructive"
      });
      return;
    }

    try {
      const initialMessage = `I'm ready to start the ${interviewType} interview for the ${role} position.`;
      const response = await conductMockInterview(initialMessage, [], role, interviewType);
      
      setConversation([
        { role: 'user', content: initialMessage },
        { role: 'assistant', content: response }
      ]);
      setIsStarted(true);
      
      toast({
        title: "Interview started!",
        description: "Good luck with your mock interview.",
      });
    } catch (error) {
      toast({
        title: "Failed to start interview",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user' as const, content: message };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    setMessage('');

    try {
      const response = await conductMockInterview(
        message,
        newConversation.slice(0, -1),
        role,
        interviewType
      );
      
      setConversation([...newConversation, { role: 'assistant', content: response }]);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetInterview = () => {
    setConversation([]);
    setIsStarted(false);
    setMessage('');
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Career Tools
        </Button>
        <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-purple-500" />
          AI Mock Interviewer
        </h1>
        <p className="text-navy-600 mt-2">
          Practice interviews with AI for any role
        </p>
      </div>

      {!isStarted ? (
        <Card>
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Role/Position
              </label>
              <Input
                placeholder="e.g., Software Engineer, Product Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Interview Type
              </label>
              <div className="flex gap-2">
                <Button
                  variant={interviewType === 'behavioral' ? 'default' : 'outline'}
                  onClick={() => setInterviewType('behavioral')}
                >
                  Behavioral
                </Button>
                <Button
                  variant={interviewType === 'technical' ? 'default' : 'outline'}
                  onClick={() => setInterviewType('technical')}
                >
                  Technical
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              {loading ? 'Starting...' : 'Start Interview'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{role}</Badge>
              <Badge className="bg-purple-500">{interviewType}</Badge>
            </div>
            <Button variant="outline" onClick={resetInterview}>
              Reset Interview
            </Button>
          </div>
          
          <Card className="h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle>Interview Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-100 ml-8'
                        : 'bg-gray-100 mr-8'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {msg.role === 'user' ? 'You' : 'Interviewer'}
                    </div>
                    <div className="text-sm">{msg.content}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your response..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !message.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MockInterviewTool;
