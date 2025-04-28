# EVCache – кешування користувацького профілю
@EVCache(key = "#userId", cacheName = "UserProfiles", ttl = 300)
public UserProfile getUserProfile(String userId) {
    return userRepository.findById(userId);
}

# Kafka – надсилання події перегляду
@Autowired
private KafkaTemplate<String, ViewEvent> kafkaTemplate;

public void sendViewingEvent(ViewEvent event) {
    kafkaTemplate.send("viewing-events", event);
}

# Hystrix – захист сервісу від збоїв залежностей
@HystrixCommand(fallbackMethod = "getFallbackCatalog")
public List<Movie> getCatalog(String userId) {
    Rating[] ratings = restTemplate.getForObject("http://ratings-service/ratings/" + userId, Rating[].class);

    return Arrays.stream(ratings)
        .map(rating -> restTemplate.getForObject("http://movies-service/movies/" + rating.getMovieId(), Movie.class))
        .collect(Collectors.toList());
}

public List<Movie> getFallbackCatalog(String userId) {
    return List.of(new Movie("0", "Недоступно", "Сервіс тимчасово недоступний"));
}

# Chaos Monkey – конфігурація fault injection
{
  "chaosType": "TerminateInstance",
  "targetGroup": "user-service",
  "interval": "hourly",
  "probability": 0.2
}

# Metaflow – приклад побудови ML pipeline
from metaflow import FlowSpec, step

class RecommendationFlow(FlowSpec):

    @step
    def start(self):
        self.user_data = load_user_data()
        self.next(self.train)

    @step
    def train(self):
        self.model = train_model(self.user_data)
        self.next(self.end)

    @step
    def end(self):
        print("Модель збережено:", self.model)

# Content-based recommendation – спрощена логіка рекомендацій
def recommend(user_id):
    history = get_watch_history(user_id)
    top_genres = extract_top_genres(history)
    unseen = get_unwatched_titles(user_id)
    return filter_by_genres(unseen, top_genres)[:10]