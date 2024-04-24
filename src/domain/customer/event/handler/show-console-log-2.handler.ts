import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import EventInterface from "../../../@shared/event/event.interface";
import CustomerCreated2Event from "../customer-created-2.event";

export default class ShowConsoleLog2Handler
    implements EventHandlerInterface<CustomerCreated2Event> {
    
    handle(event: EventInterface): void {
        console.log("Esse é o segundo console.log do evento: CustomerCreated.")
    }

}