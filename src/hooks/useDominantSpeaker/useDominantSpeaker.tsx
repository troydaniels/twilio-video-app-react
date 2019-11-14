import { useEffect, useState } from 'react';
import { useVideoContext } from '../context';
import { RemoteParticipant } from 'twilio-video';

export default function useDominantSpeaker() {
  const { room } = useVideoContext();
  const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker);

  useEffect(() => {
    const handleDominantSpeakerChanged = (dominantSpeaker: RemoteParticipant) => {
      if (dominantSpeaker !== null) {
        setDominantSpeaker(dominantSpeaker);
      }
    };

    const handleParticipantDisconnected = (participant: RemoteParticipant) => {
      if (participant === dominantSpeaker) {
        setDominantSpeaker(null);
      }
    };

    room.on('dominantSpeakerChanged', handleDominantSpeakerChanged);
    room.on('participantDisconnected', handleParticipantDisconnected);
    return () => {
      room.off('dominantSpeakerChanged', handleDominantSpeakerChanged);
      room.off('participantDisconnected', handleParticipantDisconnected);
    };
  }, [room]);

  return dominantSpeaker;
}
