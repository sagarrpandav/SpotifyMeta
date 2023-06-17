import styled from "styled-components";

const LOGIN_URI = process.env.NODE_ENV !== 'production' ? 'http://localhost:8888/login' : 'https://spotify-meta-1f4cb02eb4f3.herokuapp.com/login';

const StyledLoginContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoginButton = styled.a`
  background-color: var(--green);
  color: var(--white);
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
`;

export const Login = () => (
    <StyledLoginContainer>
        <StyledLoginButton href={LOGIN_URI}>
            Log in to Spotify
        </StyledLoginButton>
    </StyledLoginContainer>
);
