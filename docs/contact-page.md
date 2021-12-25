# Contact Page

- Create a new page
- Choose your favorite URL and title
- Select the `Archive Contact` template from the Template drop down
- Publish the page
- To add the page to the navigation

➡️ Add your content and the contact form code using [FORMSPREE](https://formspree.io/) as a service. Please check the code example below.

```html
<form action="https://formspree.io/your@email"
    class="mx-auto max-w-2xl mb-16"
    method="POST">
    <input class="mb-8" name="name" type="text" placeholder="Your Name *" required>
    <input class="mb-8" name="email" type="email" placeholder="Your Email *" required>
    <textarea class="mb-8" name="message" placeholder="Your Message" required></textarea>
    <button type="submit" class="button is-primary is-large">Send Message</button>
</form>
```

![Contact Page](https://user-images.githubusercontent.com/10253167/146421233-943e58c3-61f4-4ac7-aa37-c171a2f6642d.jpg)
