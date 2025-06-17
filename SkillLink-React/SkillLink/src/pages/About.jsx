import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 0.8rem;
  border-bottom: 3px solid #3498db;
  display: inline-block;
  padding-bottom: 4px;
`;

const Text = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
`;

const ContactLink = styled.a`
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const About = () => {
    return (
        <Container>
            <Title>About SkillLink</Title>

            <Section>
                <SectionTitle>Who We Are</SectionTitle>
                <Text>
                    SkillLink is a modern platform dedicated to connecting skilled professionals with
                    innovative career opportunities. We aim to bridge the gap between talent and industry,
                    empowering individuals to grow their skills and advance their careers.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Our Mission</SectionTitle>
                <Text>
                    Our mission is to provide accessible and efficient skill development and job matching services,
                    helping both learners and employers succeed in a competitive market.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Our Vision</SectionTitle>
                <Text>
                    We envision a world where everyone has equal access to career opportunities and professional growth,
                    regardless of their background or location.
                </Text>
            </Section>

            <Section>
                <SectionTitle>Contact Us</SectionTitle>
                <Text>
                    If you have any questions or feedback, please feel free to reach out to us at{' '}
                    <ContactLink href="mailto:mahirta@code.edu.az">mahirta@code.edu.az</ContactLink>.
                </Text>
            </Section>
        </Container>
    );
};

export default About;
