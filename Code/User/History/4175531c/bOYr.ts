export class Review {
	public nickname: string;
	public summary: string;
	public review: string;

	constructor(nickname: string, summary: string, review: string) {
		this.nickname = nickname;
		this.summary = summary;
		this.review = review;
	}
}