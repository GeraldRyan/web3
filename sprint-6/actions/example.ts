import {
	ActionFn,
	Context,
	Event,
	TransactionEvent,
} from '@tenderly/actions';

export const connectFourFn: ActionFn = async (context: Context, event: Event) => {
	let transactionEvent = event as TransactionEvent;
	console.log("Hey all")
	console.log(transactionEvent);
}
