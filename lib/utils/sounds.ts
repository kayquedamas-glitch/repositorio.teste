// Sound effects utility for mission completion and notifications
export const playSound = (type: "success" | "error" | "notification" | "typing") => {
  if (typeof window === "undefined") return

  // Create audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Configure sound based on type
  switch (type) {
    case "success":
      oscillator.frequency.value = 800
      gainNode.gain.value = 0.3
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.1)
      setTimeout(() => {
        const osc2 = audioContext.createOscillator()
        const gain2 = audioContext.createGain()
        osc2.connect(gain2)
        gain2.connect(audioContext.destination)
        osc2.frequency.value = 1000
        gain2.gain.value = 0.3
        osc2.start()
        osc2.stop(audioContext.currentTime + 0.15)
      }, 100)
      break

    case "error":
      oscillator.frequency.value = 200
      gainNode.gain.value = 0.3
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.2)
      break

    case "notification":
      oscillator.frequency.value = 600
      gainNode.gain.value = 0.2
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.05)
      break

    case "typing":
      oscillator.frequency.value = 400
      gainNode.gain.value = 0.05
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.02)
      break
  }
}

export const playCelebration = () => {
  // Play a victory fanfare
  if (typeof window === "undefined") return

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

  const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

  notes.forEach((freq, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = freq
      gainNode.gain.value = 0.2

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.2)
    }, index * 150)
  })
}
