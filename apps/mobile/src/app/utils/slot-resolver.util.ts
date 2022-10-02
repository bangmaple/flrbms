interface SlotDetail {
  startTime: string;
  endTime: string;
}
const SLOTS = new Map<number, SlotDetail>([]);
SLOTS.set(1, {
  startTime: '7:00',
  endTime: '8:30'
});
SLOTS.set(2, {
  startTime: '8:45',
  endTime: '10:15'
});
SLOTS.set(3, {
  startTime: '10:30',
  endTime: '12:00'
});
SLOTS.set(4, {
  startTime: '12:30',
  endTime: '14:00'
});
SLOTS.set(5, {
  startTime: '14:15',
  endTime: '15:45'
});
SLOTS.set(6, {
  startTime: '16:00',
  endTime: '17:30'
});
export const getTimeDetailBySlotNumber = (slot: number) => SLOTS.get(slot);
