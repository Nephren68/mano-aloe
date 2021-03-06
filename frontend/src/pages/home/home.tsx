import React from 'react';
import MessageCardSection from '../../components/messageCardSection/messageCardSection';
import {Message} from "../../models/message";
import {toCountry} from "../../models/country";
import ManoAloeService from "../../controllers/mano-aloe.service";
import SessionService from "../../services/session.service";
import './home.css'

export interface HomePageProps {

}

export interface HomePageState {
    loading: boolean;
    messages: Message[];
}

export default class HomePage extends React.Component<HomePageProps, HomePageState> {

    constructor(props: HomePageProps,
                private manoAloeService: ManoAloeService) {
        super(props);
        this.manoAloeService = new ManoAloeService();
    }

    state: HomePageState = {
        loading: true,
        messages: []
    }

    componentDidMount() {
        this.getData();
    }

    private getData(): void {
        const cachedMessages: Message[] | null = SessionService.getMessages();
        if (cachedMessages && cachedMessages.length) {
            this.setState({loading: false, messages: cachedMessages});
        } else {
            this.manoAloeService.getAllMessages()
                .then((messages: Message[]) => {
                    for (let message of messages) {
                        message.country = toCountry(message.country as string);
                    }
                    SessionService.saveMessages(messages);
                    this.setState({loading: false, messages});
                })
                .catch((error: Error) => {
                    console.error(error);
                })
        }
    }

    renderMessageCardSection() {
        return (
            <div>
                <div className="separator"/>
                <div className="video-container">
                    <iframe title="Mano Aloe Fanmade Video" className="video-tag"
                            src="https://www.youtube-nocookie.com/embed/1QdGzRGSuOM?rel=0" frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen/>
                </div>
                <div className="separator"/>
								<div className="notice-center">
									<div className="notice-container">
										<a href="https://manoaloe.jetri.co">
											<div className="notice-content">Check out dragonjet's site too!</div>
										</a>
									</div>
								</div>
                <section id='anchor'>
                    <div className="wrapper-overlay">
                        <MessageCardSection data={this.state.messages}/>
                    </div>
                </section>
								<div className="notice-center">
									<div className="notice-container">
										<div className="notice-content">
                                            <p>Those were all the messages we managed to collect, but there were many more sent your way! Please check <a href="https://twitter.com/hashtag/%E3%82%A2%E3%83%AD%E3%82%A8Worldwide?src=hashtag">#アロエWorldwide</a> and <a href="https://twitter.com/hashtag/Global%E3%82%A2%E3%83%AD%E3%82%A8?src=hashtag">#Globalアロエ</a> on Twitter, or visit <a href="https://manoaloe.jetri.co/">dragonjet</a>'s site!</p>
                                            <p>これがすべての取集したメッセージですが、他にもたくさん送りましたよ！<a href="https://twitter.com/hashtag/%E3%82%A2%E3%83%AD%E3%82%A8Worldwide?src=hashtag">#アロエWorldwide</a> と <a href="https://twitter.com/hashtag/Global%E3%82%A2%E3%83%AD%E3%82%A8?src=hashtag">#Globalアロエ</a> をツイッターでチェックしてくださいね！ そして<a href="https://manoaloe.jetri.co/">dragonjet</a>のサイトでもメッセージが収集してあります！</p>
										</div>
									</div>
								</div>
            </div>
        )
    }

    render() {
        return (
            <div className="home-root">
                {this.state.loading ? 'Now Loading...' : this.renderMessageCardSection()}
            </div>
        )
    }
}
