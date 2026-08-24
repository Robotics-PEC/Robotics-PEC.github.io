import { AlertCircle, Clock } from 'lucide-react';

interface ClosedPageCardProps {
  title?: string;
  message?: string;
  showIcon?: boolean;
}

const FeatureDisabled = ({
  title = "Applications Closed",
  message = "This page is not currently accepting responses. Please check back later.",
  showIcon = true,
}: ClosedPageCardProps) => {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-slate-200 p-8">
        {showIcon && (
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-center text-slate-900 mb-3">
          {title}
        </h1>

        <p className="text-center text-slate-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-md border border-blue-200">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            We'll notify you when responses are accepted again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeatureDisabled;