import { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

/**
 * مكون صفحة تسجيل الدخول
 * يطلب من المستخدم إدخال اسم المستخدم وكلمة المرور
 */

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // بيانات تسجيل الدخول الافتراضية
  // يمكنك تغييرها هنا
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = '12345';

  /**
   * دالة التحقق من بيانات تسجيل الدخول
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // محاكاة تأخير الشبكة
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // حفظ حالة تسجيل الدخول في التخزين المحلي
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        onLogin();
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        setPassword('');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* بطاقة تسجيل الدخول */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* الشعار والعنوان */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              نظام الفواتير
            </h1>
            <p className="text-gray-500">
              الرجاء تسجيل الدخول للمتابعة
            </p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* حقل اسم المستخدم */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-4 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-right"
                  placeholder="أدخل اسم المستخدم"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-4 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-right"
                  placeholder="أدخل كلمة المرور"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحقق...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>
        </div>

        {/* معلومات الأمان */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🔒 هذا النظام محمي ومخصص للموظفين المصرح لهم فقط
          </p>
        </div>
      </div>
    </div>
  );
}
