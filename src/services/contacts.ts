import { Contact } from '../database/entities/Contact';
import { findOneOrFail } from './base';

export const findContactById = async (contactId: string) => {
  return findOneOrFail(Contact, { where: { id: contactId } });
};
