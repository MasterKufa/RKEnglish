import { Box, Button, IconButton, TextField } from '@mui/material';
import {
  useAddWordMutation,
  useTranslateWordMutation,
} from 'ducks/reducers/api/words.api';
import React, { useCallback } from 'react';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { StyledStack } from '../styled';
import { theme } from 'globalStyle/theme';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Lang } from '../types';
import { useAppDispatch, useSESelector } from 'ducks/hooks';
import { resetAddWord, setInputWord } from 'ducks/reducers/words';
import { useRecordCustomAudio } from './hooks/useRecordCustomAudio';
import { TranslatePayload } from 'ducks/reducers/types';
import { LoadingButton } from '@mui/lab';

export const AddOne: React.FC = () => {
  const { addDraft } = useSESelector((state) => state.words);
  const dispatch = useAppDispatch();
  const [addWord] = useAddWordMutation();
  const [translate, { isLoading: translateLoading }] =
    useTranslateWordMutation();

  const { onPlayClick, onMicroClick, readAudioChunks, resetCustomAudio } =
    useRecordCustomAudio();
  const onAdd = useCallback(async () => {
    const { base64EnAudio, base64RuAudio } = await readAudioChunks();

    addWord({
      english: addDraft.input[Lang.english],
      russian: addDraft.input[Lang.russian],
      base64EnAudio,
      base64RuAudio,
    });
    dispatch(resetAddWord());
    resetCustomAudio();
  }, [addWord, dispatch, addDraft, readAudioChunks, resetCustomAudio]);

  const onTranslate = useCallback(() => {
    if (addDraft.input[Lang.english]) {
      translate({ english: addDraft.input[Lang.english] }).then((res) =>
        dispatch(
          setInputWord({
            input: (res as { data: TranslatePayload })?.data?.russian || '',
            lang: Lang.russian,
          }),
        ),
      );
    }

    if (addDraft.input[Lang.russian]) {
      translate({ english: addDraft.input[Lang.english] }).then((res) =>
        dispatch(
          setInputWord({
            input: (res as { data: TranslatePayload })?.data?.english || '',
            lang: Lang.english,
          }),
        ),
      );
    }
  }, [addDraft.input, translate, dispatch]);

  const onEnglishInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(setInputWord({ input: e.target.value, lang: Lang.english })),
    [dispatch],
  );

  const onRussianInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(setInputWord({ input: e.target.value, lang: Lang.russian })),
    [dispatch],
  );

  return (
    <StyledStack>
      <TextField
        label="En"
        value={addDraft.input[Lang.english]}
        onChange={onEnglishInputChange}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onMicroClick(Lang.english)}>
          {addDraft.audio[Lang.english].hasRecord ? (
            <RestartAltIcon />
          ) : (
            <KeyboardVoiceIcon
              sx={{
                color: addDraft.audio[Lang.english].isRecording
                  ? theme.palette.info.dark
                  : 'auto',
              }}
            />
          )}
        </IconButton>

        {addDraft.audio[Lang.english].hasRecord && (
          <IconButton onClick={onPlayClick(Lang.english)}>
            {addDraft.audio[Lang.english].isPlaying ? (
              <StopIcon />
            ) : (
              <PlayCircleOutlineIcon />
            )}
          </IconButton>
        )}
      </Box>

      <TextField
        label="Ru"
        value={addDraft.input[Lang.russian]}
        onChange={onRussianInputChange}
      />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onMicroClick(Lang.russian)}>
          {addDraft.audio[Lang.russian].hasRecord ? (
            <RestartAltIcon />
          ) : (
            <KeyboardVoiceIcon
              sx={{
                color: addDraft.audio[Lang.russian].isRecording
                  ? theme.palette.info.dark
                  : 'auto',
              }}
            />
          )}
        </IconButton>

        {addDraft.audio[Lang.russian].hasRecord && (
          <IconButton onClick={onPlayClick(Lang.russian)}>
            {addDraft.audio[Lang.russian].isPlaying ? (
              <StopIcon />
            ) : (
              <PlayCircleOutlineIcon />
            )}
          </IconButton>
        )}
      </Box>
      <Button
        disabled={
          !addDraft.input[Lang.russian] || !addDraft.input[Lang.english]
        }
        variant="contained"
        onClick={onAdd}
      >
        Add
      </Button>
      <LoadingButton
        disabled={
          Boolean(
            !addDraft.input[Lang.russian] && !addDraft.input[Lang.english],
          ) ||
          Boolean(addDraft.input[Lang.russian] && addDraft.input[Lang.english])
        }
        loading={translateLoading}
        variant="contained"
        onClick={onTranslate}
      >
        Translate
      </LoadingButton>
    </StyledStack>
  );
};
