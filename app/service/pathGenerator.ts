import { makePathGenerator } from '~/utils/makePathGenerator';

export const pathGenerator = {
  rending: makePathGenerator('/'),
  room: {
    addItem: makePathGenerator('/:roomId/addItem'),
    calculate: makePathGenerator('/:roomId/calculate'),
    result: makePathGenerator('/:roomId/result'),
  },
} as const;

export default pathGenerator;
