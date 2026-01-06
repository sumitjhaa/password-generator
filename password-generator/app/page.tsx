"use client"
import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Check, RefreshCw, Shield, Lock, Sun, Moon } from "lucide-react";

function App() {
	const [length, setLength] = useState(16);
	const [nums, setNumsAllow] = useState(true);
	const [char, setCharAllow] = useState(true);
	const [uppercase, setUppercase] = useState(true);
	const [lowercase, setLowercase] = useState(true);
	const [excludeSimilar, setExcludeSimilar] = useState(false);
	const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
	const [password, setPassword] = useState("");
	const [copied, setCopied] = useState(false);
	const [strength, setStrength] = useState(0);
	const [isDark, setIsDark] = useState(true);

	const passwordRef = useRef(null);

	const calculateStrength = useCallback((pass) => {
		let score = 0;

		if (pass.length >= 8) score += 1;
		if (pass.length >= 12) score += 1;
		if (pass.length >= 16) score += 1;
		if (pass.length >= 20) score += 1;

		if (/[a-z]/.test(pass)) score += 1;
		if (/[A-Z]/.test(pass)) score += 1;
		if (/[0-9]/.test(pass)) score += 1;
		if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

		const types = [/[a-z]/.test(pass), /[A-Z]/.test(pass), /[0-9]/.test(pass), /[^a-zA-Z0-9]/.test(pass)].filter(Boolean).length;
		if (types >= 3) score += 1;
		if (types === 4) score += 1;

		return Math.min(score, 10);
	}, []);

	const passwordGenerator = useCallback(() => {
		let pass = "";
		let str = "";

		if (uppercase) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if (lowercase) str += "abcdefghijklmnopqrstuvwxyz";
		if (nums) str += "0123456789";
		if (char) str += "!@#$%^&*-_+=[]{}~`|:;<>?,./";

		if (excludeSimilar) {
			str = str.replace(/[il1Lo0O]/g, "");
		}

		if (excludeAmbiguous) {
			str = str.replace(/[{}[\]()/\\'"~,;:.<>]/g, "");
		}

		if (str.length === 0) {
			str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		}

		for (let i = 0; i < length; i++) {
			let character = Math.floor(Math.random() * str.length);
			pass += str.charAt(character);
		}

		setPassword(pass);
		setStrength(calculateStrength(pass));
	}, [length, nums, char, uppercase, lowercase, excludeSimilar, excludeAmbiguous, calculateStrength]);

	useEffect(() => {
		passwordGenerator();
	}, [passwordGenerator]);

	const copyPasswordToClipboard = useCallback(() => {
		window.navigator.clipboard.writeText(password);
		passwordRef.current?.select();
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [password]);

	const getStrengthColor = () => {
		if (strength <= 3) return "from-red-500 to-red-600";
		if (strength <= 5) return "from-orange-500 to-orange-600";
		if (strength <= 7) return "from-yellow-500 to-yellow-600";
		if (strength <= 8) return "from-blue-500 to-blue-600";
		return "from-green-500 to-green-600";
	};

	const getStrengthText = () => {
		if (strength <= 3) return "Very Weak";
		if (strength <= 5) return "Weak";
		if (strength <= 7) return "Fair";
		if (strength <= 8) return "Good";
		if (strength <= 9) return "Strong";
		return "Very Strong";
	};

	const getStrengthIcon = () => {
		if (strength <= 5) return <Shield className="text-red-500" size={24} />;
		if (strength <= 8) return <Shield className="text-yellow-500" size={24} />;
		return <Lock className="text-green-500" size={24} />;
	};

	const getActiveSteps = () => {
		if (strength <= 3) return 3;
		if (strength <= 5) return 5;
		if (strength <= 7) return 7;
		if (strength <= 8) return 8;
		return 10;
	};

	const sliderPercent = ((length - 8) / (30 - 8)) * 100;

	return (
		<div className={`min-h-screen flex items-center justify-center p-4 lg:p-8 transition-colors duration-500 select-none ${isDark ? 'bg-gray-900' : 'bg-gray-50'
			}`}>
			<style>{`
				/* Prevent text selection globally */
				* {
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
				}

				/* Allow selection only for password input */
				input[type="text"][readonly] {
					-webkit-user-select: text;
					-moz-user-select: text;
					-ms-user-select: text;
					user-select: text;
				}

				/* Grid Background */
				.grid-bg {
					background-image: 
						linear-gradient(${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(139, 92, 246, 0.08)'} 1px, transparent 1px),
						linear-gradient(90deg, ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(139, 92, 246, 0.08)'} 1px, transparent 1px);
					background-size: 50px 50px;
					background-position: center center;
				}

				/* Custom Toggle Switch */
				.custom-checkbox {
					--off: ${isDark ? '#374151' : '#c7cad1'};
					--mid: ${isDark ? '#6366f1' : '#829ad6'};
					--on: ${isDark ? '#3b82f6' : '#255ff4'};
					--transDur: 0.3s;
					--timing: cubic-bezier(0.6,0,0.4,1);
					background-color: var(--off);
					border-radius: 0.67em;
					box-shadow:
						0 0.05em 0.1em rgba(0,0,0,0.03) inset,
						0 -0.25em 0.25em rgba(0,0,0,0.06) inset,
						0 -0.5em 0 rgba(0,0,0,0.06) inset,
						0 0.1em 0.1em rgba(0,0,0,0.06);
					cursor: pointer;
					position: relative;
					width: 2.5em;
					height: 1.5em;
					-webkit-appearance: none;
					appearance: none;
					-webkit-tap-highlight-color: transparent;
					transition: background-color var(--transDur) var(--timing);
					flex-shrink: 0;
					outline: none !important;
				}
				.custom-checkbox:before {
					background: ${isDark ? 'linear-gradient(180deg, #1f2937 0%, #111827 100%)' : 'linear-gradient(180deg, #fff 0%, #f5f5f5 100%)'};
					border-radius: 0.5em;
					box-shadow:
						0 0.175em 0.175em 0 rgba(0,0,0,0.06) inset,
						0 0.375em 0 rgba(0,0,0,0.12) inset,
						0 0.375em 0 var(--off) inset,
						0 0.475em 0.1em rgba(0,0,0,0.06) inset;
					content: "";
					display: block;
					position: absolute;
					top: 0.125em;
					left: 0.125em;
					width: 1em;
					height: 1em;
					transition: all var(--transDur) var(--timing);
				}
				.custom-checkbox:checked {
					background-color: var(--on);
					animation: checkboxPulse 0.3s ease-out;
				}
				.custom-checkbox:checked:before {
					box-shadow:
						0 0.175em 0.175em 0 rgba(0,0,0,0.06) inset,
						0 0.375em 0 rgba(0,0,0,0.12) inset,
						0 0.375em 0 var(--on) inset,
						0 0.475em 0.1em rgba(0,0,0,0.06) inset;
					left: calc(100% - 1.125em);
				}

				@keyframes checkboxPulse {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.05); }
				}

				/* Custom Range Slider */
				.range-slider {
					position: relative;
				}

				.range-slider input[type="range"] {
					width: 100%;
					height: 4px;
					-webkit-appearance: none;
					appearance: none;
					background: ${isDark ? '#1f2937' : '#E3E3E3'};
					background-image: linear-gradient(${isDark ? '#6b7280' : '#667eea'}, ${isDark ? '#6b7280' : '#667eea'});
					background-size: ${sliderPercent}% 100%;
					background-repeat: no-repeat;
					border-radius: 10px;
					outline: none;
					cursor: pointer;
					transition: background-size 0.3s ease;
				}

				.range-slider input[type="range"]::-webkit-slider-thumb {
					-webkit-appearance: none;
					appearance: none;
					width: 12px;
					height: 30px;
					background: ${isDark ? '#9ca3af' : '#667eea'};
					border-radius: 0;
					cursor: grab;
					transition: all 0.3s ease;
				}

				.range-slider input[type="range"]::-moz-range-thumb {
					width: 12px;
					height: 30px;
					background: ${isDark ? '#9ca3af' : '#667eea'};
					border: none;
					border-radius: 0;
					cursor: grab;
					transition: all 0.3s ease;
				}

				.range-slider input[type="range"]:hover::-webkit-slider-thumb {
					background: ${isDark ? '#d1d5db' : '#764ba2'};
					transform: scaleY(0.75);
				}

				.range-slider input[type="range"]:hover::-moz-range-thumb {
					background: ${isDark ? '#d1d5db' : '#764ba2'};
					transform: scaleY(0.75);
				}

				.range-slider input[type="range"]:active::-webkit-slider-thumb {
					cursor: grabbing;
				}

				.range-slider input[type="range"]:active::-moz-range-thumb {
					cursor: grabbing;
				}

				.range-slider input[type="range"]::-moz-range-track {
					background: transparent;
				}

				/* Enhanced Glassmorphism container */
				.glass-container {
					background: ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
					backdrop-filter: blur(40px) saturate(180%);
					-webkit-backdrop-filter: blur(40px) saturate(180%);
					border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(139, 92, 246, 0.2)'};
				}

				/* Button animations */
				@keyframes buttonPress {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(0.95); }
				}

				@keyframes iconSpin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}

				.btn-copy:active {
					animation: buttonPress 0.2s ease;
				}

				.btn-refresh:active svg {
					animation: iconSpin 0.5s ease;
				}

				.btn-refresh:active svg {
					animation: iconSpin .6s ease;
				}
			`}</style>

			<div className="grid-bg fixed inset-0"></div>

			<div className="w-full max-w-5xl relative z-10">
				{/* Header with Theme Toggle */}
				<div className="flex justify-between items-center mb-6">
					<div className={`text-3xl lg:text-5xl font-bold tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'
						}`}>
						Password Generator
					</div>
					<button
						onClick={() => setIsDark(!isDark)}
						className={`p-3 rounded-xl transition-all duration-300 glass-container ${isDark
							? 'text-gray-300 hover:bg-gray-800/30'
							: 'text-gray-700 hover:bg-white/30'
							} shadow-lg hover:shadow-xl hover:scale-105`}
						title="Toggle theme"
					>
						{isDark ? <Sun size={24} /> : <Moon size={24} />}
					</button>
				</div>

				<div className="glass-container rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">
					<div className="p-6 lg:p-10">
						{/* Password Display */}
						<div className="mb-8">
							<div className="flex flex-col sm:flex-row gap-3 mb-4">
								<input
									type="text"
									value={password}
									className={`flex-1 px-4 lg:px-6 py-4 lg:py-5 text-lg lg:text-xl font-mono rounded-2xl outline-none transition-all duration-300 glass-card ${isDark
										? 'border-2 border-gray-700 text-gray-100 focus:border-gray-500'
										: 'border-2 border-gray-200 text-gray-900 focus:border-purple-500'
										}`}
									placeholder="Generated password"
									readOnly
									ref={passwordRef}
								/>
								<div className="flex gap-3">
									<button
										className="btn-copy flex-1 sm:flex-none px-6 lg:px-8 py-4 lg:py-5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl text-base lg:text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105"
										onClick={copyPasswordToClipboard}
									>
										{copied ? <Check size={22} /> : <Copy size={22} />}
										{copied ? "Copied!" : "Copy"}
									</button>
									<button
										className={`btn-refresh px-5 lg:px-6 py-4 lg:py-5 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${isDark
											? 'glass-card text-gray-300 border border-gray-700 hover:bg-gray-800/30'
											: 'glass-card text-gray-700 border border-gray-300'
											}`}
										onClick={passwordGenerator}
										title="Generate new password"
									>
										<RefreshCw size={22} />
									</button>
								</div>
							</div>

							{/* Enhanced Strength Indicator */}
							<div className={`glass-card p-5 lg:p-6 rounded-2xl transition-colors duration-300 ${isDark ? 'border border-gray-700' : 'border border-gray-200'
								}`}>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-3">
										{getStrengthIcon()}
										<div>
											<p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Password Strength</p>
											<p className={`text-xl lg:text-2xl font-bold ${strength <= 3 ? 'text-red-600' :
												strength <= 5 ? 'text-orange-600' :
													strength <= 7 ? 'text-yellow-600' :
														strength <= 8 ? 'text-blue-600' :
															'text-green-600'
												}`}>
												{getStrengthText()}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Score</p>
										<p className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>{strength}/10</p>
									</div>
								</div>
								<div className="flex gap-1 h-3 lg:h-4">
									{[...Array(10)].map((_, i) => (
										<div
											key={i}
											className={`flex-1 rounded-full transition-all duration-300 ${i < getActiveSteps() ? `bg-gradient-to-r ${getStrengthColor()}` : isDark ? 'bg-gray-700' : 'bg-gray-300'
												}`}
										/>
									))}
								</div>
							</div>
						</div>

						<div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
							{/* Left Column */}
							<div className="space-y-6">

								<h3 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Basic Configuration</h3>

								{/* Length Slider */}
								<div className={`glass-card p-5 lg:p-6 rounded-2xl transition-colors duration-300 ${isDark ? 'border border-gray-700' : 'border border-purple-200'
									}`}>
									<div className="flex justify-between items-center mb-4">
										<label className={`font-bold text-base lg:text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Password Length</label>
										<span className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{length}</span>
									</div>
									<div className="range-slider">
										<input
											type="range"
											min={8}
											max={30}
											value={length}
											onChange={(e) => setLength(Number(e.target.value))}
										/>
									</div>
									<div className={`flex justify-between text-xs lg:text-sm mt-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
										<span>8 chars</span>
										<span>30 chars</span>
									</div>
								</div>

								{/* Character Types */}
								<div className="space-y-3">
									<h3 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Character Types</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<										label className={`glass-card flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 hover:scale-[1.02] ${isDark
											? 'border-gray-700 hover:border-gray-600'
											: 'border-gray-200 hover:border-purple-300'
											}`}>
											<input
												type="checkbox"
												checked={uppercase}
												onChange={() => setUppercase((prev) => !prev)}
												className="custom-checkbox"
											/>
											<span className={`font-semibold text-sm lg:text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Uppercase (A-Z)</span>
										</label>

										<label className={`glass-card flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 hover:scale-[1.02] ${isDark
											? 'border-gray-700 hover:border-purple-600'
											: 'border-gray-200 hover:border-purple-300'
											}`}>
											<input
												type="checkbox"
												checked={lowercase}
												onChange={() => setLowercase((prev) => !prev)}
												className="custom-checkbox"
											/>
											<span className={`font-semibold text-sm lg:text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Lowercase (a-z)</span>
										</label>

										<label className={`glass-card flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 hover:scale-[1.02] ${isDark
											? 'border-gray-700 hover:border-purple-600'
											: 'border-gray-200 hover:border-purple-300'
											}`}>
											<input
												type="checkbox"
												checked={nums}
												onChange={() => setNumsAllow((prev) => !prev)}
												className="custom-checkbox"
											/>
											<span className={`font-semibold text-sm lg:text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Numbers (0-9)</span>
										</label>

										<label className={`glass-card flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 hover:scale-[1.02] ${isDark
											? 'border-gray-700 hover:border-purple-600'
											: 'border-gray-200 hover:border-purple-300'
											}`}>
											<input
												type="checkbox"
												checked={char}
												onChange={() => setCharAllow((prev) => !prev)}
												className="custom-checkbox"
											/>
											<span className={`font-semibold text-sm lg:text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Symbols (!@#$)</span>
										</label>
									</div>
								</div>
							</div>

							{/* Right Column */}
							<div className="space-y-6">
								{/* Advanced Options */}
								<div className="space-y-3">
									<h3 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Advanced Options</h3>
									<div className="flex flex-col sm:flex-row gap-3">
										<label className={`glass-card flex-1 flex items-center gap-3 p-4 lg:p-5 rounded-xl cursor-pointer transition-all border-2 hover:scale-[1.02] ${isDark
											? 'border-gray-700 hover:border-gray-600'
											: 'border-blue-200 hover:border-blue-400'
											}`}>
											<input
												type="checkbox"
												checked={excludeSimilar}
												onChange={() => setExcludeSimilar((prev) => !prev)}
												className="custom-checkbox"
											/>
											<div>
												<span className={`font-semibold text-sm lg:text-base block ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Exclude Similar</span>
												<p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>i, l, 1, L, o, 0, O</p>
											</div>
										</label>

										<label className={`glass-card flex-1 flex items-center gap-3 p-4 lg:p-5 rounded-xl cursor-pointer transition-all border-2 hover:scale-[1.02] ${isDark
											? 'border-gray-700 hover:border-gray-600'
											: 'border-blue-200 hover:border-blue-400'
											}`}>
											<input
												type="checkbox"
												checked={excludeAmbiguous}
												onChange={() => setExcludeAmbiguous((prev) => !prev)}
												className="custom-checkbox"
											/>
											<div>
												<span className={`font-semibold text-sm lg:text-base block ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Exclude Ambiguous</span>
												<p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{'{ } [ ] ( ) / \\ etc.'}</p>
											</div>
										</label>
									</div>
								</div>

								{/* Tips Section */}
								<div
									className={`p-5 lg:p-6 border-l-4 rounded-xl transition-colors duration-300
										${isDark
											? 'bg-green-500/10 border-green-400/40'
											: 'bg-green-200/40 border-green-500'
										}`}
								>
									<h4 className={`font-bold mb-3 text-base lg:text-lg flex items-center gap-2 ${isDark ? 'text-grey-100' : 'text-green-900'}`}>
										<span className="text-xl">💡</span> Password Security Tips
									</h4>
									<ul className={`text-sm lg:text-base space-y-2 ${isDark ? 'text-grey-200' : 'text-green-800'}`}>
										<li className="flex items-start gap-2">
											<span className={`font-bold ${isDark ? 'text-gray-500' : 'text-green-600'}`}>•</span>
											<span>Use at least 16 characters for maximum security</span>
										</li>
										<li className="flex items-start gap-2">
											<span className={`font-bold ${isDark ? 'text-gray-500' : 'text-green-600'}`}>•</span>
											<span>Combine uppercase, lowercase, numbers, and symbols</span>
										</li>
										<li className="flex items-start gap-2">
											<span className={`font-bold ${isDark ? 'text-gray-500' : 'text-green-600'}`}>•</span>
											<span>Never reuse passwords across different accounts</span>
										</li>
										<li className="flex items-start gap-2">
											<span className={`font-bold ${isDark ? 'text-gray-500' : 'text-green-600'}`}>•</span>
											<span>Consider using a password manager</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;