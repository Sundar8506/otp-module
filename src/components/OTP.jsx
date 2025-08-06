import { useState, useRef, useEffect } from "react";
export default function OTP({ otpLength = 6 }) {
  const [otpfields, setOtpfields] = useState(new Array(otpLength).fill(""));
  const ref = useRef([]);

  function handleKeyDown(e, index) {
    const key = e.key;

    if (key === "ArrowLeft") {
      if (index > 0) ref.current[index - 1].focus();
      return;
    }

    if (key === "ArrowRight") {
      if (index + 1 < otpfields.length) ref.current[index + 1].focus();
      return;
    }

    const copyotpfield = [...otpfields];
    if (key === "Backspace" || "Delete") {
      copyotpfield[index] = "";
      setOtpfields(copyotpfield);

      if (index > 0) ref.current[index - 1].focus();
    }

    if (!/^\d$/.test(key)) {
      return;
    }
    copyotpfield[index] = key;
    setOtpfields(copyotpfield);

    if (index + 1 < otpfields.length) ref.current[index + 1].focus();
  }
  function handlepaste(e) {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.match(/\d/g);
    if (!digits) return;
    const nextOtp = otpfields.slice();

    for (let i = 0; i < otpLength && digits.length; ++i) {
      nextOtp[i] = digits[i];
    }
    setOtpfields(nextOtp);
    const nextFocus = digits.length < otpLength ? digits.length : otpLength - 1;
    ref.current[nextFocus]?.focus();
  }

  useEffect(() => {
    ref.current[0]?.focus();
  }, []);

  return (
    <div className="container">
      {otpfields.map((value, index) => (
        <input
          key={index}
          ref={(currentInput) => (ref.current[index] = currentInput)}
          value={value}
          type="text"
          maxLength={1}
          className="otp-input"
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlepaste}
        />
      ))}
    </div>
  );
}
