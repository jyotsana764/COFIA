
import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div className="text-gray-700">

      {/* Page Heading */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"ABOUT"} text2={"COFIA"} />
      </div>

      {/* About COFIA */}
      <div className="my-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center">

        <img
          className="w-full md:max-w-[450px] object-cover"
          src={assets.about_img}
          alt="COFIA fashion collection"
        />

        <div className="flex flex-col justify-center gap-5 md:w-2/4 text-gray-600 leading-7">

          <p className="text-lg font-medium text-gray-800">
            Explore Your Style. Express Yourself.
          </p>

          <p>
            At <strong className="text-gray-900">COFIA</strong>, fashion is
            more than what you wear — it's how you express who you are.
            We believe every outfit tells a story, every style reflects
            a personality, and everyone deserves to feel confident in
            what they wear.
          </p>

          <p>
            Our journey began with a simple vision: to make discovering
            your personal style effortless, exciting, and accessible.
            From everyday essentials to statement pieces, COFIA brings
            together styles that complement your lifestyle and celebrate
            your individuality.
          </p>

          <div className="flex flex-col gap-3">
            <b className="text-gray-900 text-lg">Our Mission</b>
            <p>
              Our mission is to make fashion accessible, enjoyable, and
              personal. We aim to bring you thoughtfully selected styles,
              a convenient shopping experience, and fashionable choices
              that fit your taste and budget.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <b className="text-gray-900 text-lg">Our Vision</b>
            <p>
              We envision COFIA as a destination where style meets
              simplicity — a place that inspires creativity, celebrates
              individuality, and helps everyone discover looks that feel
              uniquely their own.
            </p>
          </div>

        </div>
      </div>

      {/* Why Choose COFIA */}
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE COFIA"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 text-sm mb-20">

        {/* Card 1 */}
        <div className="border border-gray-200 px-8 md:px-10 py-12 flex flex-col gap-5 hover:bg-gray-50 transition-all duration-300">
          <div className="text-3xl">✦</div>

          <b className="text-gray-900 text-base">
            Curated Collections
          </b>

          <p className="text-gray-600 leading-7">
            Discover versatile fashion selected to complement different
            tastes, occasions, and lifestyles. From everyday essentials
            to standout looks, find styles that feel like you.
          </p>
        </div>

        {/* Card 2 */}
        <div className="border border-gray-200 px-8 md:px-10 py-12 flex flex-col gap-5 hover:bg-gray-50 transition-all duration-300">
          <div className="text-3xl">◇</div>

          <b className="text-gray-900 text-base">
            Style Meets Value
          </b>

          <p className="text-gray-600 leading-7">
            Express yourself with fashionable choices that suit your
            budget. We believe great style should feel accessible,
            helping you create looks you love without unnecessary
            compromises.
          </p>
        </div>

        {/* Card 3 */}
        <div className="border border-gray-200 px-8 md:px-10 py-12 flex flex-col gap-5 hover:bg-gray-50 transition-all duration-300">
          <div className="text-3xl">♡</div>

          <b className="text-gray-900 text-base">
            Shopping Made Simple
          </b>

          <p className="text-gray-600 leading-7">
            Enjoy a convenient online shopping experience as you explore
            your favourites, discover new arrivals, and choose pieces
            for every moment. Your next favourite look is just a few
            clicks away.
          </p>
        </div>

      </div>

      {/* Brand Promise */}
      <div className="text-center max-w-3xl mx-auto mb-20 px-5">
        <p className="text-xs tracking-[0.3em] text-gray-500 mb-4">
          THE COFIA PROMISE
        </p>

        <h2 className="text-2xl md:text-3xl text-gray-900 mb-5">
          Your Style. Your Story.
        </h2>

        <p className="text-gray-600 leading-7">
          Your style inspires us. At COFIA, we're here to make every
          fashion discovery exciting and every shopping experience
          enjoyable. Find what feels right for you and wear it with
          confidence.
        </p>
      </div>

      {/* Newsletter */}
      <NewsLetterBox />

    </div>
  );
};

export default About;
