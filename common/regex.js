// 车牌号
export const plateRegex = '^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$';

// 正整数（包括0）
export const integerRegex = '^[+]{0,1}(\\d+)$';

// 正数（包括0，保留小数点2位）
export const positiveRegex = '^((0{1}\\.\\d{1,2})|([1-9]\\d*\\.{1}\\d{1,2})|([1-9]+\\d*)|0)$';

// 身份证
export const card18 = '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$';
export const card15 = '^[1-9]\\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{2}$';

// 社会统一信用代码
export const socialCodeRegex = '^([0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\\d{14})$';

// 手机号
export const phoneRegex = '^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\\d{8}$';

// 日期格式（yyyy-mm-dd)
export const dateFormatRegex = '^\\d{4}-\\d{1,2}-\\d{1,2}';

// 日期格式（yyyy年mm月dd日)
export const dateFormatCHRegex = '^\\d{4}年\\d{1,2}月\\d{1,2}日';