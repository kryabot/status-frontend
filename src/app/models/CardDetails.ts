export class CardDetails {
  constructor(title) {
    this.title = title;
  }
  title: string;
  loading: boolean = true;
  status: boolean = null;
  started: Date = null;

  isLoading():boolean{
    return this.status == null && this.started == null;
  }
}
