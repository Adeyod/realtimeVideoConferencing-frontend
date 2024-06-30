const HomeScreen = () => {
  return (
    <div className="flex flex-col gap-16 md:gap-20 py-20">
      <div className="">
        <p className="font-bold italic text-4xl lg:text-4xl">
          Video conferencing made easy
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-around ">
        <div className="flex w-[150px] md:w-[350px] lg:w-[450px]">
          <img src="../../images/user.png" alt="" className="" />
        </div>

        <div className="mt-10 md:mt-0">
          <p className="font-bold italic text-xl lg:text-4xl">
            Welcome to the home of video conferencing
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
