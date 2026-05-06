import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, RotateCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  content: string;
  loading: boolean;
  onRegenerate?: () => void;
  emptyHint?: string;
}

export const OutputPanel = ({ content, loading, onRegenerate, emptyHint }: Props) => {
  const copy = async () => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="rounded-2xl border bg-card shadow-card p-5 min-h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin text-primary" /> Generating…</>
          ) : content ? (
            <span className="font-medium text-foreground">Result</span>
          ) : (
            <span>Output will appear here</span>
          )}
        </div>
        {content && !loading && (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={copy}><Copy className="h-4 w-4 mr-1" />Copy</Button>
            {onRegenerate && (
              <Button size="sm" variant="ghost" onClick={onRegenerate}><RotateCw className="h-4 w-4 mr-1" />Regenerate</Button>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed prose-pre:bg-muted">
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : !loading ? (
          <p className="text-muted-foreground text-sm">{emptyHint}</p>
        ) : null}
      </div>
      {content && (
        <p className="text-[11px] text-muted-foreground mt-4 pt-3 border-t">
          ⚠️ AI outputs may contain inaccuracies. Please review and edit before use.
        </p>
      )}
    </div>
  );
};