// Placeholder for MediaPipe Pose integration.
// Suggested next step: use @mediapipe/tasks-vision or @mediapipe/pose.
// Example (tasks-vision):
// import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
// const vision = await FilesetResolver.forVisionTasks("/wasm");
// const landmarker = await PoseLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: "/models/pose_landmarker.task" } });

export async function initPose() {
  // no-op starter
  return null;
}

export function runPostureChecks(landmarks, settings) {
  if (!landmarks || !settings) return { errors: [] };

  // Map indices similar to your Python app: eyes (2,5), shoulders (11,12)
  const getY = (idx) => (landmarks[idx] ? landmarks[idx].y : null);

  const leftEyeY = getY(2);
  const rightEyeY = getY(5);
  const leftShoulderY = getY(11);
  const rightShoulderY = getY(12);

  const errors = [];

  if (leftEyeY != null && rightEyeY != null && settings.eyeHeightLeniency != null) {
    const avgEyeY = (leftEyeY + rightEyeY) / 2;
    // In browser coords, smaller y is higher; use a configurable baseline from calibration later
    // For now, only return structure
  }

  if (leftShoulderY != null && rightShoulderY != null && settings.shoulderUnevennessLeniency != null) {
    const shoulderDelta = Math.abs(leftShoulderY - rightShoulderY);
    if (shoulderDelta > settings.shoulderUnevennessLeniency) {
      errors.push('Uneven shoulders');
    }
  }

  if (leftEyeY != null && rightEyeY != null && settings.headHeightLeniency != null) {
    const headTilt = Math.abs(rightEyeY - leftEyeY);
    if (headTilt > settings.headHeightLeniency) {
      errors.push('Head tilt detected');
    }
  }

  return { errors };
}


