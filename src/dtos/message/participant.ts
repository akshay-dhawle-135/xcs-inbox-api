import { z } from 'zod';
import {
  addParticipantBodySchema,
  addParticipantPathSchema,
} from '../../validations/addParticipants';

export type IAddParticipantBody = z.infer<typeof addParticipantBodySchema>;

export type IAddParticipantPath = z.infer<typeof addParticipantPathSchema>;
