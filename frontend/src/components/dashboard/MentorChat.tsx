import { FC } from 'react';

export interface MentorMessage {
  id: string;
  from: 'user' | 'mentor';
  text: string;
}

interface MentorChatProps {
  messages: MentorMessage[];
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
}

const MentorChat: FC<MentorChatProps> = ({
  messages,
  input,
  setInput,
  onSend,
  isSending,
}) => {
  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-950/90 shadow-[0_22px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-5 flex flex-col">
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 via-emerald-300 to-cyan-400 flex items-center justify-center text-xs font-semibold text-slate-950">
            CL
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
              Mentor
            </div>
            <div className="text-sm text-slate-100">Online • Clario</div>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 border border-emerald-400/60">
          Accountability
        </span>
      </header>

      <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-900/70 border border-slate-800/90 px-3 py-3 space-y-2 text-xs custom-scroll">
        {messages.length === 0 && (
          <div className="text-[11px] text-slate-500 leading-relaxed">
            Tell your mentor what you’re planning to finish in the next 25
            minutes. You’ll get a short, direct response based on your
            actual tasks.
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${
              msg.from === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed ${
                msg.from === 'user'
                  ? 'bg-sky-500/90 text-slate-950 rounded-br-sm'
                  : 'bg-slate-800/90 text-slate-100 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-pulse" />
            Clario is thinking…
          </div>
        )}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={2}
          placeholder="Tell Clario what you finished, what slipped, or what you’re committing to next."
          className="flex-1 resize-none rounded-2xl bg-slate-900/80 border border-slate-800/90 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/60 custom-scroll"
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || isSending}
          className="h-9 w-9 flex items-center justify-center rounded-2xl bg-emerald-500/90 text-slate-950 text-xs font-semibold hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ↗
        </button>
      </div>
    </section>
  );
};

export default MentorChat;

