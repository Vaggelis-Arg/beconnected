package com.beconnected.model;

public class FeedItem {
    private String content;
    private String author;

    public FeedItem(String content, String author) {
        this.content = content;
        this.author = author;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
